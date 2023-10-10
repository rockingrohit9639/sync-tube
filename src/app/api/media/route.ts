import path from 'path'
import { randomUUID } from 'crypto'
import fs from 'fs/promises'
import { getServerSession } from 'next-auth'
import { NextRequest, NextResponse } from 'next/server'
import { HttpStatusCode } from 'axios'
import { authOptions } from '../auth/[...nextauth]/route'
import { env } from '~/lib/utils/env.mjs'
import { prisma } from '~/server/db'
import { isErrnoException } from '~/lib/utils/file'

async function getUploadDirectory(basePath: string, userId: string) {
  const uploadDir = path.resolve(basePath, env.UPLOAD_DIR, userId)
  try {
    await fs.stat(uploadDir)
  } catch (error) {
    if (isErrnoException(error) && error.code === 'ENOENT') {
      await fs.mkdir(uploadDir, { recursive: true })
    } else {
      throw error
    }
  }

  return uploadDir
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    return NextResponse.json({ success: false, message: 'Unauthorized user!' }, { status: HttpStatusCode.Unauthorized })
  }

  try {
    const formData = await req.formData()
    const file = formData.get('file') as File
    if (!file) {
      return NextResponse.json({ success: false, message: 'File is required!' }, { status: 400 })
    }
    /** @TODO Validate file constraints */
    const basePath = process.cwd()
    const uploadDirectory = await getUploadDirectory(basePath, session.user.id)

    /** Saving the file into the UPLOAD_DIR */
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const ext = file.type.split('/')[1]
    const filename = `${randomUUID()}.${ext}`

    const filepath = path.resolve(uploadDirectory, filename)
    await fs.writeFile(filepath, buffer)

    /** Saving the file object in database */
    const fileSaved = await prisma.file.create({
      data: {
        originalName: file.name,
        filename,
        mimetype: file.type,
        size: file.size,
        path: filepath,
        uploadedBy: { connect: { id: session.user.id } },
      },
    })
    const fileUrl = `${req.url}/${fileSaved.id}`
    return NextResponse.json({ ...fileSaved, url: fileUrl }, { status: HttpStatusCode.Created })
  } catch (error) {}
}
