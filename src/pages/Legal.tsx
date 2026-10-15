import { ArrowLeft, FileText, ShieldCheck } from 'lucide-react'
import { siteConfig, val } from '@/data/site'
import { Button } from '@/components/ui/Button'
import { Logo } from '@/components/layout/Logo'
import { Footer } from '@/components/layout/Footer'

const Pending = ({ children }: { children: string }) => (
  <span className="mx-1 rounded-md border border-bronze-400/40 bg-bronze-300/15 px-1.5 py-0.5 text-[0.82em] text-bronze-600">
    {children}
  </span>
)

export type LegalKind = 'mentions-legales' | 'politique-de-confidentialite'

export function Legal({ kind }: { kind: LegalKind }) {
  const isLegal = kind === 'mentions-legales'
  const email = val(siteConfig.contact.email)
  const phone = val(siteConfig.contact.phone)

  return (
    <div className="min-h-screen bg-alu-100">
      <header className="border-b border-ink-900/8 bg-white/80 backdrop-blur-xl">
        <div className="container-x flex items-center justify-between py-4">
          <a href="#accueil" aria-label="Retour à l’accueil">
            <Logo tone="light" />
          </a>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              window.location.hash = '#accueil'
            }}
            icon={<ArrowLeft className="size-3.5" />}
          >
            Retour au site
          </Button>
        </div>
      </header>

      <main className="container-x max-w-3xl py-16 md:py-24">
        <p className="flex items-center gap-2.5 text-[0.68rem] uppercase tracking-[0.3em] text-ink-500">
          {isLegal ? <FileText className="size-4" /> : <ShieldCheck className="size-4" />}
          Informations légales
        </p>
        <h1 className="mt-5 font-display text-[clamp(1.9rem,4.4vw,2.9rem)] leading-tight tracking-tight text-ink-900">
          {isLegal ? 'Mentions légales' : 'Politique de confidentialité'}
        </h1>

        <div className="mt-10 grid gap-9 text-[0.94rem] leading-relaxed text-ink-600">
          {isLegal ? (
            <>
              <section>
                <h2 className="font-display text-[1.15rem] tracking-tight text-ink-900">Éditeur du site</h2>
                <p className="mt-3">
                  {siteConfig.legalName} — {siteConfig.tagline}. Les informations d’identification de la société
                  (dénomination sociale exacte, forme juridique, capital, RC, ICE, adresse du siège) doivent être
                  complétées avant la mise en ligne :
                  <Pending>À COMPLÉTER : RC / ICE / forme juridique</Pending>
                </p>
                <ul className="mt-3 grid gap-1.5">
                  <li>
                    Téléphone :{' '}
                    {phone ?? <Pending>À COMPLÉTER dans src/data/site.ts</Pending>}
                  </li>
                  <li>
                    E-mail : {email ?? <Pending>À COMPLÉTER dans src/data/site.ts</Pending>}
                  </li>
                  <li>
                    Adresse :{' '}
                    {val(siteConfig.contact.address.city) ?? <Pending>Adresse du siège à compléter</Pending>}
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="font-display text-[1.15rem] tracking-tight text-ink-900">
                  Hébergement &amp; propriété intellectuelle
                </h2>
                <p className="mt-3">
                  Les textes, visuels, plans et marques présents sur ce site sont protégés. Toute reproduction, même
                  partielle, sans autorisation écrite préalable est interdite. Les photographies actuellement utilisées
                  sont des visuels d’illustration (images générées) qui doivent être remplacées par les réalisations
                  réelles de {siteConfig.legalName} avant publication.
                </p>
                <p className="mt-3">
                  Hébergeur : <Pending>Nom, adresse et téléphone de l’hébergeur à compléter</Pending>
                </p>
              </section>

              <section>
                <h2 className="font-display text-[1.15rem] tracking-tight text-ink-900">Données &amp; devis</h2>
                <p className="mt-3">
                  Les informations transmises via le configurateur et le formulaire de devis servent exclusivement à
                  l’étude de votre projet. Aucun prix n’est généré automatiquement : chaque devis est établi sur mesure
                  après échange avec nos équipes.
                </p>
              </section>

              <section>
                <h2 className="font-display text-[1.15rem] tracking-tight text-ink-900">Médiation &amp; litiges</h2>
                <p className="mt-3">
                  En cas de difficulté, une solution amiable sera recherchée en priorité. Le droit applicable est le
                  droit marocain.
                </p>
              </section>
            </>
          ) : (
            <>
              <section>
                <h2 className="font-display text-[1.15rem] tracking-tight text-ink-900">Responsable du traitement</h2>
                <p className="mt-3">
                  {siteConfig.legalName} — les coordonnées du responsable du traitement restent à compléter (
                  <Pending>contact à renseigner</Pending>).
                </p>
              </section>

              <section>
                <h2 className="font-display text-[1.15rem] tracking-tight text-ink-900">Données collectées</h2>
                <ul className="mt-3 grid list-disc gap-1.5 pl-5">
                  <li>Formulaire de devis : nom, téléphone, e-mail, ville, type de projet, dimensions, message.</li>
                  <li>Fichiers joints le cas échéant (photos, plans) : nom, type et taille du fichier.</li>
                  <li>
                    Configurateur : type de produit, matériau, dimensions, couleur, vitrage, nombre de vantaux, ville,
                    installation.
                  </li>
                  <li>Aucune donnée n’est utilisée à des fins publicitaires ni revendue.</li>
                </ul>
              </section>

              <section>
                <h2 className="font-display text-[1.15rem] tracking-tight text-ink-900">Finalité &amp; base légale</h2>
                <p className="mt-3">
                  Ces données sont traitées pour répondre à votre demande de devis et préparer la prise de mesures, sur
                  la base de votre consentement (envoi volontaire du formulaire).
                </p>
              </section>

              <section>
                <h2 className="font-display text-[1.15rem] tracking-tight text-ink-900">Conservation</h2>
                <p className="mt-3">
                  Les demandes sont conservées le temps nécessaire au traitement commercial, puis supprimées. Une copie
                  des demandes envoyées depuis ce site est également enregistrée localement dans votre navigateur
                  (stockage local) afin de vous permettre de retrouver votre récapitulatif ; vous pouvez la supprimer à
                  tout moment en vidant les données de votre navigateur.
                </p>
              </section>

              <section>
                <h2 className="font-display text-[1.15rem] tracking-tight text-ink-900">Vos droits</h2>
                <p className="mt-3">
                  Conformément à la loi marocaine n° 09-08 relative à la protection des personnes physiques à l’égard du
                  traitement des données à caractère personnel (CNDP), vous disposez d’un droit d’accès, de
                  rectification, d’opposition et de suppression. Pour l’exercer, contactez-nous aux coordonnées
                  figurant en pied de page — <Pending>e-mail de contact à compléter</Pending>.
                </p>
              </section>

              <section>
                <h2 className="font-display text-[1.15rem] tracking-tight text-ink-900">Cookies</h2>
                <p className="mt-3">
                  Ce site n’utilise pas de cookie publicitaire ni de traceur tiers. Seul un stockage local technique
                  (récapitulatif de votre demande) peut être utilisé dans votre navigateur.
                </p>
              </section>
            </>
          )}

          <div className="rounded-2xl border border-ink-900/10 bg-white/70 p-5 text-[0.85rem] text-ink-500">
            <p className="font-medium text-ink-800">Document à valider</p>
            <p className="mt-2">
              Ce texte est un modèle de travail : faites-le valider par votre conseil juridique et complétez les champs
              signalés avant la mise en ligne du site.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
