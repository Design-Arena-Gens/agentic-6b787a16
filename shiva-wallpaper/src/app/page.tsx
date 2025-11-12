import { WallpaperCanvas } from "@/components/WallpaperCanvas";

export default function Home() {
  return (
    <div className="min-h-screen w-full bg-[radial-gradient(circle_at_20%_0%,rgba(55,120,255,0.25),rgba(2,4,12,0.9)),linear-gradient(160deg,rgba(6,9,18,0.9),rgba(4,6,14,0.98))] py-16 text-white sm:py-24">
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-16 px-6 sm:px-10 lg:px-16">
        <section className="grid items-center gap-12 lg:grid-cols-[1.1fr_1fr] lg:gap-20">
          <div className="flex flex-col gap-6">
            <p className="text-xs uppercase tracking-[0.8em] text-blue-300/80">
              Divine Motion Series
            </p>
            <h1 className="text-balance font-black leading-[1.05] tracking-tight text-transparent text-white drop-shadow-[0_30px_90px_rgba(34,120,255,0.45)] md:text-6xl text-4xl">
              भगवान शिव का प्रचंड तांडव
            </h1>
            <p className="max-w-lg text-pretty text-base leading-7 text-blue-100/80 sm:text-lg sm:leading-8">
              बिजली की लपटों और धूल के बवंडर के मध्य विराजमान महादेव का अल्ट्रा
              सिनेमैटिक 8K वॉलपेपर। चमकती नाग-फणी, दिव्य नीला तेज और ऊर्जामय ऑरा
              आपके iPhone के हर फ्रेम को जीवंत कर देता है।
            </p>
          </div>
          <div className="flex items-center justify-center">
            <WallpaperCanvas />
          </div>
        </section>
      </main>
    </div>
  );
}
