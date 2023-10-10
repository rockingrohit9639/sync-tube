import fs from 'fs'
import { getServerSession } from 'next-auth'
import { NextRequest, NextResponse } from 'next/server'
import { HttpStatusCode } from 'axios'
import { authOptions } from '../../auth/[...nextauth]/route'
import { findVideoById } from '~/server/routers/video/video.service'
import { prisma } from '~/server/db'
import { MB } from '~/lib/utils/constants'

export async function GET(req: NextRequest, context: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    return NextResponse.json({ success: false, message: 'Unauthorized user!' }, { status: HttpStatusCode.Unauthorized })
  }

  const videoId = context.params.id
  if (!videoId) {
    return NextResponse.json({ success: false, message: 'Video id not found!' }, { status: HttpStatusCode.NotFound })
  }

  const video = await findVideoById(prisma, videoId)
  const file = video.file
  if (!file) {
    return NextResponse.json({ success: false, message: 'Video file not found!' }, { status: HttpStatusCode.NotFound })
  }

  const range = req.headers.get('range')
  if (!range) {
    return NextResponse.json({ success: false, message: 'Range not found!' }, { status: HttpStatusCode.NotFound })
  }

  const videoSizeInBytes = fs.statSync(file.path).size
  const chunkStart = Number(range.replace(/\D/g, ''))
  const chunkEnd = Math.min(chunkStart + MB, videoSizeInBytes - 1)
  const contentLength = chunkEnd - chunkStart + 1

  const headers = {
    'Content-Range': `bytes ${chunkStart}-${chunkEnd}/${videoSizeInBytes}`,
    'Accept-Ranges': 'bytes',
    'Content-Length': contentLength.toString(),
    'Content-Type': 'video/mp4',
  }

  try {
    const videoStream = fs.createReadStream(file.path, { start: chunkStart, end: chunkEnd })
    return new Response(videoStream as any, { status: 206, headers })
  } catch (error) {
    return NextResponse.json({ error: 'Something went wrong!' }, { status: 400 })
  }
}
