using System.Drawing;
using System.Drawing.Drawing2D;
using System.Drawing.Imaging;
using System.Runtime.InteropServices;

const int width = 1280;
const int height = 720;

var projectRoot = Path.GetFullPath(Path.Combine(AppContext.BaseDirectory, "..", "..", "..", "..", ".."));
var sourceDir = Path.Combine(projectRoot, "Cursor-Movement");
var outputDir = Path.Combine(projectRoot, "public", "cursor-frames");
var blinkSourceDir = Path.Combine(projectRoot, "Blink animation");
var blinkOutputDir = Path.Combine(projectRoot, "public", "blink-frames");

if (!Directory.Exists(sourceDir))
{
    throw new DirectoryNotFoundException(sourceDir);
}

Directory.CreateDirectory(outputDir);
Directory.CreateDirectory(blinkOutputDir);

var frames = Directory
    .GetFiles(sourceDir, "ezgif-frame-*.png")
    .OrderBy(path => int.Parse(Path.GetFileNameWithoutExtension(path).Replace("ezgif-frame-", "")))
    .ToArray();

for (var index = 0; index < frames.Length; index += 1)
{
    ProcessFrame(frames[index], Path.Combine(outputDir, Path.GetFileName(frames[index])));

    if ((index + 1) % 25 == 0 || index == frames.Length - 1)
    {
        Console.WriteLine($"Processed {index + 1} / {frames.Length}");
    }
}

if (Directory.Exists(blinkSourceDir))
{
    var blinkFramesForIdle = Directory
        .GetFiles(blinkSourceDir, "blink-*.png")
        .OrderBy(path => int.Parse(Path.GetFileNameWithoutExtension(path).Replace("blink-", "")))
        .ToArray();
    var blinkEzgifFramesForIdle = Directory
        .GetFiles(blinkSourceDir, "ezgif-frame-*.png")
        .OrderBy(path => int.Parse(Path.GetFileNameWithoutExtension(path).Replace("ezgif-frame-", "")))
        .ToArray();

    for (var index = 0; index < blinkFramesForIdle.Length; index += 1)
    {
        ProcessFrame(blinkFramesForIdle[index], Path.Combine(blinkOutputDir, $"ezgif-frame-{index + 1:000}.png"));
    }

    for (var index = 0; index < blinkEzgifFramesForIdle.Length; index += 1)
    {
        ProcessFrame(blinkEzgifFramesForIdle[index], Path.Combine(blinkOutputDir, Path.GetFileName(blinkEzgifFramesForIdle[index])));
    }

    Console.WriteLine($"Processed {blinkFramesForIdle.Length + blinkEzgifFramesForIdle.Length} blink frames.");
}

static void ProcessFrame(string inputPath, string outputPath)
{
    using var source = Image.FromFile(inputPath);
    using var bitmap = new Bitmap(width, height, PixelFormat.Format32bppArgb);

    using (var graphics = Graphics.FromImage(bitmap))
    {
        graphics.CompositingMode = CompositingMode.SourceCopy;
        graphics.CompositingQuality = CompositingQuality.HighQuality;
        graphics.InterpolationMode = InterpolationMode.HighQualityBicubic;
        graphics.SmoothingMode = SmoothingMode.HighQuality;
        graphics.PixelOffsetMode = PixelOffsetMode.HighQuality;
        graphics.DrawImage(source, 0, 0, width, height);
    }

    var rect = new Rectangle(0, 0, width, height);
    var data = bitmap.LockBits(rect, ImageLockMode.ReadWrite, PixelFormat.Format32bppArgb);
    var stride = Math.Abs(data.Stride);
    var bytes = new byte[stride * height];
    Marshal.Copy(data.Scan0, bytes, 0, bytes.Length);

    var pixelCount = width * height;
    var outside = new byte[pixelCount];
    var queue = new int[pixelCount];
    var head = 0;
    var tail = 0;

    void Enqueue(int pixel)
    {
        if (outside[pixel] != 0 || Brightness(bytes, stride, pixel) > 3)
        {
            return;
        }

        outside[pixel] = 1;
        queue[tail] = pixel;
        tail += 1;
    }

    for (var x = 0; x < width; x += 1)
    {
        Enqueue(x);
        Enqueue((height - 1) * width + x);
    }

    for (var y = 1; y < height - 1; y += 1)
    {
        Enqueue(y * width);
        Enqueue(y * width + width - 1);
    }

    while (head < tail)
    {
        var pixel = queue[head];
        head += 1;

        var x = pixel % width;
        var y = pixel / width;

        if (x > 0) Enqueue(pixel - 1);
        if (x < width - 1) Enqueue(pixel + 1);
        if (y > 0) Enqueue(pixel - width);
        if (y < height - 1) Enqueue(pixel + width);
    }

    var left = Enumerable.Repeat(width, height).ToArray();
    var right = Enumerable.Repeat(-1, height).ToArray();

    for (var y = 0; y < height; y += 1)
    {
        for (var x = 0; x < width; x += 1)
        {
            var pixel = y * width + x;
            if (Brightness(bytes, stride, pixel) <= 20)
            {
                continue;
            }

            left[y] = Math.Min(left[y], x);
            right[y] = Math.Max(right[y], x);
        }
    }

    for (var y = 1; y < height; y += 1)
    {
        if (right[y] <= left[y])
        {
            left[y] = left[y - 1];
            right[y] = right[y - 1];
        }
    }

    for (var y = height - 2; y >= 0; y -= 1)
    {
        if (right[y] <= left[y])
        {
            left[y] = left[y + 1];
            right[y] = right[y + 1];
        }
    }

    for (var y = 0; y < height; y += 1)
    {
        var rowStart = y * width;
        var span = right[y] - left[y];
        var inset = y < height * 0.48 ? 18 : 28;

        for (var x = 0; x < width; x += 1)
        {
            var pixel = rowStart + x;
            var offset = y * stride + x * 4;
            var insideCharacterSpan = span > 140 && x > left[y] + inset && x < right[y] - inset;
            var bright = Brightness(bytes, stride, pixel);

            bytes[offset + 3] = outside[pixel] != 0 && bright <= 10 && !insideCharacterSpan
                ? (byte)0
                : (byte)255;
        }
    }

    Marshal.Copy(bytes, 0, data.Scan0, bytes.Length);
    bitmap.UnlockBits(data);
    bitmap.Save(outputPath, ImageFormat.Png);
}

static int Brightness(byte[] bytes, int stride, int pixel)
{
    var y = pixel / width;
    var x = pixel % width;
    var offset = y * stride + x * 4;
    return Math.Max(bytes[offset + 2], Math.Max(bytes[offset + 1], bytes[offset]));
}
