import { PageHero } from "@/components/shared/PageHero";
import { FadeInView } from "@/components/shared/FadeInView";
import { Separator } from "@/components/ui/separator";

const stones = [
  "https://images.squarespace-cdn.com/content/v1/66b1a338c892d668d1cacfa9/ddad4c0d-b8cd-44f1-a953-c7336c4d0029/IMG20250204081758.jpg?format=1500w",
  "https://images.squarespace-cdn.com/content/v1/66b1a338c892d668d1cacfa9/c467e7ff-c469-4aa1-b47a-0ea5a982c18d/IMG20250205073102.jpg?format=1500w",
  "https://images.squarespace-cdn.com/content/v1/66b1a338c892d668d1cacfa9/307b62bd-dd8a-48ae-ac0c-04ec26894e5e/IMG20250205073030.jpg?format=1500w",
  "https://images.squarespace-cdn.com/content/v1/66b1a338c892d668d1cacfa9/e9bee59d-7997-4582-b0e8-29a4be5be5b0/IMG20250205075930.jpg?format=1500w",
  "https://images.squarespace-cdn.com/content/v1/66b1a338c892d668d1cacfa9/faf51c38-5782-4613-bc25-698ab30e02e8/IMG20250205091433.jpg?format=1500w",
  "https://images.squarespace-cdn.com/content/v1/66b1a338c892d668d1cacfa9/2c5d1344-b7b3-4b0e-ab7e-3bca8869c0d5/IMG20250206075732.jpg?format=1500w",
  "https://images.squarespace-cdn.com/content/v1/66b1a338c892d668d1cacfa9/36b7c7d1-ba4a-4f55-ae33-a8ab66f586f0/IMG20250206081022.jpg?format=1500w",
  "https://images.squarespace-cdn.com/content/v1/66b1a338c892d668d1cacfa9/ccfa798e-e15f-4076-a9b3-728b46e72fdb/IMG20250206081022.jpg?format=1500w",
  "https://images.squarespace-cdn.com/content/v1/66b1a338c892d668d1cacfa9/5c5da58a-afd4-4404-b1c8-ac4b5dd24762/IMG20250206081809.jpg?format=1500w",
  "https://images.squarespace-cdn.com/content/v1/66b1a338c892d668d1cacfa9/8a0fe525-b7ff-4806-916a-d071d4444bd1/IMG20250206081830.jpg?format=1500w",
  "https://images.squarespace-cdn.com/content/v1/66b1a338c892d668d1cacfa9/856cfa65-51ca-4c63-ada7-650cb92e93fe/IMG20250206082610.jpg?format=1500w",
  "https://images.squarespace-cdn.com/content/v1/66b1a338c892d668d1cacfa9/4b078f7b-0094-407a-aef5-f3b1ccb9df5a/IMG20250206085351.jpg?format=1500w",
  "https://images.squarespace-cdn.com/content/v1/66b1a338c892d668d1cacfa9/6c6799da-2961-4e50-867d-40fe1def54fa/IMG20250206085351.jpg?format=1500w",
  "https://images.squarespace-cdn.com/content/v1/66b1a338c892d668d1cacfa9/a1cd69c9-0c81-4ef8-a848-f4480e6b54ec/IMG20250206090857.jpg?format=1500w",
  "https://images.squarespace-cdn.com/content/v1/66b1a338c892d668d1cacfa9/5de65011-3bb0-4a1f-8a53-e27c5aa52678/IMG20250206092320.jpg?format=1500w",
  "https://images.squarespace-cdn.com/content/v1/66b1a338c892d668d1cacfa9/cf58e703-2f29-494f-9657-058867b0deeb/IMG20250206093825.jpg?format=1500w",
  "https://images.squarespace-cdn.com/content/v1/66b1a338c892d668d1cacfa9/16b1c407-77d2-4bbe-a475-72bd734eb9e3/IMG20250206094826.jpg?format=1500w",
  "https://images.squarespace-cdn.com/content/v1/66b1a338c892d668d1cacfa9/9e25e7f2-3d89-406c-b4de-8c07be2266d6/IMG20250207132920.jpg?format=300w",
  "https://images.squarespace-cdn.com/content/v1/66b1a338c892d668d1cacfa9/c58ef08f-6a64-4452-9d5c-2216334cb2d0/IMG20250208094546.jpg?format=300w",
  "https://images.squarespace-cdn.com/content/v1/66b1a338c892d668d1cacfa9/b58f3696-7bed-4ace-866b-a5b1c6dbf0b8/IMG20250208100955.jpg?format=1500w",
  "https://images.squarespace-cdn.com/content/v1/66b1a338c892d668d1cacfa9/3f1397e0-5362-4a0e-a336-faa523ad632f/IMG20250208101501.jpg?format=1500w",
  "https://images.squarespace-cdn.com/content/v1/66b1a338c892d668d1cacfa9/7c8acabb-914a-4798-90e2-20e8bb59cb03/IMG20250208095938.jpg?format=1500w",
  "https://images.squarespace-cdn.com/content/v1/66b1a338c892d668d1cacfa9/2c74175b-1622-4454-b13e-08377a037108/IMG20250208095334.jpg?format=1500w",
  "https://images.squarespace-cdn.com/content/v1/66b1a338c892d668d1cacfa9/e3b4ac7b-a567-47ba-943f-9a3b4bd553c3/IMG20250208093819.jpg?format=1500w",
  "https://images.squarespace-cdn.com/content/v1/66b1a338c892d668d1cacfa9/7fc2a5ce-1ead-4114-8944-94bcaa662492/IMG20250208084619.jpg?format=300w",
  "https://images.squarespace-cdn.com/content/v1/66b1a338c892d668d1cacfa9/3353caa9-876a-4638-8923-fda1acdd4919/IMG20250208083230.jpg?format=1500w",
];

export default function GardenOfMemoryPage() {
  return (
    <div className="pb-24">
      <PageHero
        title="Garden of Memory"
        subtitle="High on Twmbarlwm, where the clouds touch the land and the wind carries whispers across the valleys."
        size="lg"
        align="center"
      />

      {/* Intro */}
      <FadeInView>
        <section className="mx-auto max-w-2xl px-4 sm:px-6 py-16 text-center space-y-6">
          <p className="text-muted-foreground text-lg leading-relaxed">
            We have placed painted stones in memory of children gone too soon. A quiet place where love lingers,
            where memories rest, where names are spoken to the wind and carried far beyond.
          </p>
          <p className="text-muted-foreground text-base leading-relaxed">
            This is not just a memorial — it is a place of connection.
          </p>
          <p className="text-muted-foreground text-base leading-relaxed">
            Each stone holds a name, a symbol, a story. Some were left by us, others by bereaved parents who
            wanted their children&apos;s names to be part of this place.
          </p>
          <p className="text-muted-foreground text-base leading-relaxed italic">
            My daughter Tima grew up in Risca, in the shadow of Twmbarlwm, walking these paths, playing beneath
            these skies. Now, here, her memory and those of her friends rest among the hills that watch over the town.
          </p>
        </section>
      </FadeInView>

      <Separator className="bg-border max-w-6xl mx-auto" />

      {/* Stone gallery */}
      <FadeInView>
        <section className="mx-auto max-w-6xl px-4 sm:px-6 py-16">
          <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-foreground mb-3 text-center">
            The Stones
          </h2>
          <p className="text-muted-foreground text-center mb-12 max-w-xl mx-auto">
            Photographs from the hillside — each painted stone a small act of love and remembrance.
          </p>
          <div className="columns-2 sm:columns-3 lg:columns-4 gap-3 space-y-3">
            {stones.map((src, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={i}
                src={src}
                alt={`Painted memorial stone ${i + 1}`}
                className="w-full rounded-lg break-inside-avoid object-cover"
                loading="lazy"
              />
            ))}
          </div>
        </section>
      </FadeInView>

      <Separator className="bg-border max-w-6xl mx-auto" />

      {/* Leave a stone */}
      <FadeInView>
        <section className="mx-auto max-w-2xl px-4 sm:px-6 py-16 text-center space-y-6">
          <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-foreground">Leave a Stone</h2>
          <p className="text-muted-foreground text-base leading-relaxed">
            If you visit and wish to leave a stone in memory of a loved one, you are welcome to do so.
          </p>
          <p className="text-muted-foreground text-base leading-relaxed">
            A name, a message, a symbol — each stone becomes part of this quiet space, resting together
            in the soft embrace of the hills.
          </p>
          <div className="rounded-xl border border-border bg-card p-8 text-left space-y-3">
            <p className="text-muted-foreground text-sm leading-relaxed">
              <strong className="text-foreground">Location:</strong> Twmbarlwm hill, above Risca, South Wales.
              The hilltop is accessible via the footpaths from Risca or Cwmcarn Forest.
            </p>
            <p className="text-muted-foreground text-sm leading-relaxed">
              <strong className="text-foreground">What to bring:</strong> A smooth stone, a name, a symbol,
              painted or written with love. Leave it among the others near the summit.
            </p>
            <p className="text-muted-foreground text-sm leading-relaxed italic">
              &ldquo;Each stone becomes part of this quiet space, resting together in the soft embrace of the hills.&rdquo;
            </p>
          </div>
          <p className="text-muted-foreground text-sm">
            Want to share your stone or get in touch?{" "}
            <a href="/about#contact" className="text-primary hover:underline underline-offset-2">
              Contact us
            </a>
          </p>
        </section>
      </FadeInView>
    </div>
  );
}
