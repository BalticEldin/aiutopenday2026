import { put } from '@vercel/blob'
import { type NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Generate a unique filename with timestamp
    const timestamp = Date.now()
    const filename = `ut-openday-selfie-${timestamp}.png`

    // Upload to public Vercel Blob store
    const blob = await put(filename, file, {
      access: 'public',
    })

    // Return the publicly accessible URL
    return NextResponse.json({ url: blob.url })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}
