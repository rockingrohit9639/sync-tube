import { randomUUID } from 'crypto'
import { NextRequest, NextResponse } from 'next/server'
import { PutObjectCommand, S3Client, GetObjectCommand } from '@aws-sdk/client-s3'

const BUCKET = process.env.AWS_BUCKET_NAME
const s3Client = new S3Client({ region: process.env.AWS_REGION })

export async function POST(request: NextRequest) {
  const data = await request.formData()
  const file = data.get('file') as File
  if (!file) {
    return NextResponse.json({ message: 'File not found!', success: false }, { status: 400 })
  }

  const fileExtension = file.type.split('/')[1]
  const Key = `${randomUUID()}.${fileExtension}`

  const fileBuffer = await file.arrayBuffer()
  const command = new PutObjectCommand({
    Bucket: BUCKET,
    Key,
    Body: Buffer.from(fileBuffer),
  })

  await s3Client.send(command)
  return NextResponse.json({ uploadedUrl: `https://${BUCKET}.s3.amazonaws.com/${Key}`, success: true }, { status: 200 })
}
