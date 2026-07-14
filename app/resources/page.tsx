import { PageHero } from "@/components/shared/PageHero";
import { FadeInView } from "@/components/shared/FadeInView";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { ExternalLink } from "lucide-react";

interface Resource {
  title: string;
  url: string;
  description: string;
  tags: string[];
}

const helplines: Resource[] = [
  {
    title: "988 Suicide & Crisis Lifeline (US)",
    url: "https://988lifeline.org/",
    description: "Call or text 988, or chat online. 24/7 free and confidential support across the U.S.",
    tags: ["US", "24/7", "Crisis"],
  },
  {
    title: "Crisis Text Line (US)",
    url: "https://www.crisistextline.org/",
    description: "Text HOME to 741741 to connect with a trained counselor. Free, 24/7.",
    tags: ["Text", "US"],
  },
  {
    title: "Samaritans (UK & ROI)",
    url: "https://www.samaritans.org/",
    description: "Call 116 123 for free, 24/7 listening support. Welsh line available.",
    tags: ["UK", "ROI", "24/7"],
  },
  {
    title: "Canada: 9‑8‑8 Suicide Crisis Helpline",
    url: "https://988.ca/",
    description: "Call or text 9‑8‑8 for immediate support anywhere in Canada.",
    tags: ["Canada", "24/7"],
  },
  {
    title: "Lifeline (Australia)",
    url: "https://www.lifeline.org.au/",
    description: "Call 13 11 14. 24/7 crisis support and suicide prevention services.",
    tags: ["Australia", "24/7"],
  },
  {
    title: "Befrienders Worldwide",
    url: "https://www.befrienders.org/",
    description: "Global directory of emotional support centres by country.",
    tags: ["International", "Directory"],
  },
  {
    title: "IASP — Crisis Centres & Helplines",
    url: "https://www.iasp.info/crisis-centres-helplines/",
    description: "International Association for Suicide Prevention links to crisis centres worldwide.",
    tags: ["International", "Directory"],
  },
];

const books: Resource[] = [
  {
    title: "The Body Keeps the Score — Bessel van der Kolk",
    url: "https://www.amazon.com/Body-Keeps-Score-Healing-Trauma/dp/0143127748",
    description: "How trauma lives in body and mind, and paths to healing.",
    tags: ["Trauma", "Somatic"],
  },
  {
    title: "Man's Search for Meaning — Viktor E. Frankl",
    url: "https://www.amazon.com/Mans-Search-Meaning-Viktor-Frankl/dp/0807014273",
    description: "Finding meaning through suffering and responsibility.",
    tags: ["Meaning", "Logotherapy"],
  },
  {
    title: "Option B — Sheryl Sandberg & Adam Grant",
    url: "https://www.amazon.com/Option-B-Adversity-Building-Resilience/dp/1524732680",
    description: "Building resilience and rediscovering joy after adversity.",
    tags: ["Resilience"],
  },
  {
    title: "When Things Fall Apart — Pema Chödrön",
    url: "https://www.amazon.com/When-Things-Fall-Apart-Difficult/dp/1611803438",
    description: "Compassionate Buddhist wisdom for difficult times.",
    tags: ["Mindfulness"],
  },
  {
    title: "Daring Greatly — Brené Brown",
    url: "https://www.amazon.com/Daring-Greatly-Courage-Vulnerable-Transforms/dp/1592408419",
    description: "The strength of vulnerability and wholehearted living.",
    tags: ["Vulnerability", "Shame"],
  },
];

const podcasts: Resource[] = [
  {
    title: "The Trauma Therapist Podcast",
    url: "https://www.thetraumatherapistproject.com/podcast/",
    description: "Interviews with clinicians working on the frontlines of trauma recovery.",
    tags: ["Trauma", "Therapy"],
  },
  {
    title: "Unlocking Us — Brené Brown",
    url: "https://brenebrown.com/podcast/introducing-unlocking-us/",
    description: "Conversations that reflect the universal, messy, magical human experience.",
    tags: ["Humanity"],
  },
  {
    title: "The Hilarious World of Depression",
    url: "https://www.hilariousworld.org/",
    description: "Artists and comedians open up about depression with heart and humour.",
    tags: ["Depression"],
  },
  {
    title: "Mental Illness Happy Hour",
    url: "http://mentalpod.com/",
    description: "Honest, long‑form conversations about mental health (host: Paul Gilmartin).",
    tags: ["Conversations"],
  },
  {
    title: "On Being with Krista Tippett",
    url: "https://onbeing.org/series/podcast/",
    description: "Big questions of meaning, ethics, and what it means to be human.",
    tags: ["Philosophy"],
  },
];

const films: Resource[] = [
  {
    title: "The Pursuit of Happyness (2006)",
    url: "https://www.imdb.com/title/tt0454921/",
    description: "A tender story of grit, love, and the long road to stability.",
    tags: ["Resilience"],
  },
  {
    title: "Good Will Hunting (1997)",
    url: "https://www.imdb.com/title/tt0119217/",
    description: "Healing through connection, truth‑telling, and good therapy.",
    tags: ["Therapy"],
  },
  {
    title: "A Beautiful Mind (2001)",
    url: "https://www.imdb.com/title/tt0268978/",
    description: "John Nash's life with schizophrenia and extraordinary intellect.",
    tags: ["Psychosis"],
  },
  {
    title: "Inside Out (2015)",
    url: "https://www.imdb.com/title/tt2096673/",
    description: "An accessible, heartfelt explainer of emotions for all ages.",
    tags: ["Emotions", "Family"],
  },
  {
    title: "Silver Linings Playbook (2012)",
    url: "https://www.imdb.com/title/tt1045658/",
    description: "Love, relapse, and rebuilding with support.",
    tags: ["Bipolar", "Recovery"],
  },
];

const orgs: Resource[] = [
  {
    title: "NAMI — National Alliance on Mental Illness",
    url: "https://www.nami.org/Home",
    description: "Advocacy, education, support groups, and helpline in the U.S.",
    tags: ["US", "Advocacy"],
  },
  {
    title: "Mental Health America (MHA)",
    url: "https://www.mhanational.org/",
    description: "Screening tools, education, and community resources.",
    tags: ["US", "Education"],
  },
  {
    title: "The Mighty",
    url: "https://themighty.com/",
    description: "Peer stories and communities across health conditions.",
    tags: ["Community"],
  },
  {
    title: "Depression & Bipolar Support Alliance (DBSA)",
    url: "https://www.dbsalliance.org/",
    description: "Peer‑led support groups and education for mood disorders.",
    tags: ["US", "Groups"],
  },
  {
    title: "Anxiety & Depression Association of America (ADAA)",
    url: "https://adaa.org/",
    description: "Evidence‑based resources on anxiety, depression, and related disorders.",
    tags: ["US", "Clinical"],
  },
];

const apps: Resource[] = [
  {
    title: "Headspace",
    url: "https://www.headspace.com/",
    description: "Mindfulness and meditation for sleep, stress, and focus.",
    tags: ["Meditation"],
  },
  {
    title: "Calm",
    url: "https://www.calm.com/",
    description: "Sleep stories, breathwork, and guided meditations.",
    tags: ["Sleep", "Meditation"],
  },
  {
    title: "BetterHelp",
    url: "https://www.betterhelp.com/",
    description: "Online therapy platform connecting you with licensed clinicians.",
    tags: ["Therapy"],
  },
  {
    title: "7 Cups",
    url: "https://www.7cups.com/",
    description: "Free, anonymous chats with trained listeners; paid therapy available.",
    tags: ["Peer Support"],
  },
  {
    title: "NIMH — National Institute of Mental Health",
    url: "https://www.nimh.nih.gov/",
    description: "U.S. government research and public information hub on mental health.",
    tags: ["Information"],
  },
];

const specialty: Resource[] = [
  {
    title: "Mental Health & Cancer — Mesothelioma Hope",
    url: "https://www.mesotheliomahope.com/resources/mental-health/",
    description: "Coping with anxiety, depression, and stress after a cancer diagnosis; support options for patients and families.",
    tags: ["Cancer", "Caregivers", "Coping"],
  },
  {
    title: "Mental Health After a Traumatic Accident",
    url: "https://farahandfarah.com/traumatic-accidents-mental-health/",
    description: "Overview of PTSD, anxiety, and recovery pathways following serious accidents, with practical next steps.",
    tags: ["PTSD", "Anxiety", "Recovery"],
  },
  {
    title: "AddictionHelp.com — Learn, Find Support, Recover",
    url: "https://www.addictionhelp.com/",
    description: "Education and resources created by a recovering addict, family member, and an addiction doctor.",
    tags: ["Addiction", "SUD", "Recovery"],
  },
];

function ResourceCard({ resource }: { resource: Resource }) {
  return (
    <a
      href={resource.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group block rounded-xl border border-border bg-card p-6 hover:border-primary/50 transition-colors"
    >
      <div className="flex items-start justify-between gap-3 mb-2">
        <h3 className="font-serif text-lg font-semibold text-foreground group-hover:text-primary transition-colors leading-snug">
          {resource.title}
        </h3>
        <ExternalLink className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-1" />
      </div>
      <p className="text-sm text-muted-foreground leading-relaxed mb-4">{resource.description}</p>
      <div className="flex flex-wrap gap-2">
        {resource.tags.map((tag) => (
          <Badge key={tag} variant="secondary" className="text-xs">
            {tag}
          </Badge>
        ))}
      </div>
    </a>
  );
}

function Section({ id, title, resources }: { id: string; title: string; resources: Resource[] }) {
  return (
    <FadeInView>
      <section id={id} className="scroll-mt-24">
        <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-foreground mb-8">{title}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {resources.map((r) => (
            <ResourceCard key={r.url} resource={r} />
          ))}
        </div>
      </section>
    </FadeInView>
  );
}

export default function ResourcesPage() {
  const sections = [
    { id: "helplines", label: "Helplines" },
    { id: "books", label: "Books" },
    { id: "podcasts", label: "Podcasts" },
    { id: "films", label: "Films" },
    { id: "orgs", label: "Support & Organizations" },
    { id: "apps", label: "Apps & Tools" },
    { id: "specialty", label: "Specialty Topics" },
  ];

  return (
    <div className="pb-24">
      <PageHero
        title="Resources"
        subtitle="A curated collection of support, tools, and stories for those navigating grief, mental health, and healing."
        size="md"
        align="center"
      />

      {/* Quick-jump nav */}
      <div className="sticky top-16 z-10 bg-background/90 backdrop-blur border-b border-border">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-3 overflow-x-auto">
          <div className="flex gap-4 text-sm whitespace-nowrap">
            {sections.map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                className="text-muted-foreground hover:text-primary transition-colors py-1"
              >
                {s.label}
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-16 space-y-20">
        <Section id="helplines" title="Helplines" resources={helplines} />
        <Separator className="bg-border" />
        <Section id="books" title="Books" resources={books} />
        <Separator className="bg-border" />
        <Section id="podcasts" title="Podcasts" resources={podcasts} />
        <Separator className="bg-border" />
        <Section id="films" title="Films" resources={films} />
        <Separator className="bg-border" />
        <Section id="orgs" title="Support & Organizations" resources={orgs} />
        <Separator className="bg-border" />
        <Section id="apps" title="Apps & Tools" resources={apps} />
        <Separator className="bg-border" />
        <Section id="specialty" title="Specialty Topics" resources={specialty} />
      </div>

      {/* Emergency footer */}
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="rounded-xl border border-primary/30 bg-primary/5 p-6 text-center">
          <p className="text-sm text-muted-foreground">
            <strong className="text-foreground">If you&apos;re in immediate danger</strong>, call your local emergency number.<br />
            US & Canada: call or text <strong>988</strong> · UK: <strong>116 123</strong> (Samaritans) · Australia: <strong>13 11 14</strong> (Lifeline). Services vary by region.
          </p>
        </div>
      </div>
    </div>
  );
}
