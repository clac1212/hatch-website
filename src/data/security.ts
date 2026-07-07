/**
 * Copy for the Security & privacy page (`/security`, `/en/security`).
 *
 * Kept here (not in a .astro file) so FR and EN stay structurally in sync and
 * the component stays presentation-only.
 *
 * Structure: a few themed sections, each a strong promise (title + one-line
 * subtitle) backed by exactly three short cards. Modelled on dust.tt/home/security.
 * Deliberately high-level — no legal definitions, no AI-Act article numbers, no
 * internal detail. Anything granular (DPA, classification note) lives "on request",
 * not on the public page. Every claim must be true of Hatch OS.
 */
import type { Locale } from '../i18n/ui';

/** Icon keys map to inline SVGs in `Security.astro` (`ICONS`). */
export type SecurityIcon =
  | 'select'
  | 'location'
  | 'encryption'
  | 'noTrain'
  | 'noRetention'
  | 'isolation'
  | 'sso'
  | 'roles'
  | 'permissions'
  | 'gdpr'
  | 'aiAct'
  | 'doc';

export interface SecurityCard {
  icon: SecurityIcon;
  title: string;
  body: string;
}

export interface SecuritySection {
  title: string;
  subtitle: string;
  cards: SecurityCard[];
}

export interface SecurityContent {
  meta: { title: string; description: string };
  hero: { eyebrow: string; h1: string; sub: string; trust: string[]; cta: string };
  sections: SecuritySection[];
  contact: { heading: string; body: string; cta: string };
}

export const securityContent: Record<Locale, SecurityContent> = {
  fr: {
    meta: {
      title: 'Sécurité & confidentialité — Hatch OS',
      description:
        'Vous gardez le contrôle de vos données : hébergées en France, jamais utilisées pour entraîner une IA, et accessibles uniquement à qui vous décidez.',
    },
    hero: {
      eyebrow: 'Sécurité & confidentialité',
      h1: 'Vos données, en sécurité dès le premier jour',
      sub: 'Vous gardez le contrôle de ce que vous partagez, de l’endroit où c’est hébergé et de qui y accède.',
      trust: ['Conforme RGPD', 'Hébergé en France'],
      cta: 'Contacter notre équipe',
    },
    sections: [
      {
        title: 'Vous décidez de ce que vous partagez',
        subtitle: 'Vous choisissez précisément les données que Hatch OS utilise.',
        cards: [
          {
            icon: 'select',
            title: 'Sélection à la source',
            body: 'Choisissez exactement ce que Hatch OS utilise, source par source.',
          },
          {
            icon: 'location',
            title: 'Hébergé en France',
            body: 'Vos données et leurs sauvegardes restent en région France.',
          },
          {
            icon: 'encryption',
            title: 'Chiffrement de bout en bout',
            body: 'Chiffrées en transit et au repos (TLS, AES-256).',
          },
        ],
      },
      {
        title: 'Vos données n’entraînent aucune IA',
        subtitle: 'Vos contenus servent à vous rendre service, jamais à entraîner des modèles.',
        cards: [
          {
            icon: 'noTrain',
            title: 'Aucun entraînement',
            body: 'Vos données ne sont jamais utilisées pour entraîner un modèle d’IA.',
          },
          {
            icon: 'noRetention',
            title: 'Zéro rétention côté modèles',
            body: 'Vous gardez vos données ; nos fournisseurs de modèles n’en conservent rien.',
          },
          {
            icon: 'isolation',
            title: 'Cloisonnées par client',
            body: 'L’assistant ne s’appuie que sur vos documents, isolés de ceux des autres clients.',
          },
        ],
      },
      {
        title: 'Un contrôle d’accès granulaire, à chaque niveau',
        subtitle: 'Chaque membre de votre réseau n’accède qu’à ce qui le concerne.',
        cards: [
          {
            icon: 'sso',
            title: 'SSO entreprise',
            body: 'Vos équipes se connectent via votre SSO (SAML).',
          },
          {
            icon: 'roles',
            title: 'Accès par rôle',
            body: 'Des droits distincts pour le franchiseur et les franchisés.',
          },
          {
            icon: 'permissions',
            title: 'Permissions fines',
            body: 'Vous choisissez qui accède à quels documents, au sein de vos équipes.',
          },
        ],
      },
      {
        title: 'Conformité',
        subtitle: 'Le cadre européen respecté, sans le jargon.',
        cards: [
          {
            icon: 'gdpr',
            title: 'RGPD',
            body: 'Accès, export et suppression de vos données quand vous le souhaitez.',
          },
          {
            icon: 'aiAct',
            title: 'AI Act',
            body: 'Aucune IA n’évalue, ne note ni ne classe une personne.',
          },
          {
            icon: 'doc',
            title: 'Documentation',
            body: 'DPA et détail de nos mesures de sécurité disponibles sur demande.',
          },
        ],
      },
    ],
    contact: {
      heading: 'Une question sur la sécurité ?',
      body: 'Notre équipe répond à vos questionnaires sécurité et partage notre documentation détaillée sur demande.',
      cta: 'Demander une démo',
    },
  },
  en: {
    meta: {
      title: 'Security & privacy — Hatch OS',
      description:
        'You stay in control of your data: hosted in France, never used to train AI, and accessible only to whom you decide.',
    },
    hero: {
      eyebrow: 'Security & privacy',
      h1: 'Your data, secure from day one',
      sub: 'You stay in control of what you share, where it’s hosted, and who can access it.',
      trust: ['GDPR compliant', 'Hosted in France'],
      cta: 'Contact our team',
    },
    sections: [
      {
        title: 'You decide what you share',
        subtitle: 'You choose exactly which data Hatch OS uses.',
        cards: [
          {
            icon: 'select',
            title: 'Source-level selection',
            body: 'Choose exactly what Hatch OS uses, source by source.',
          },
          {
            icon: 'location',
            title: 'Hosted in France',
            body: 'Your data and its backups stay in a France region.',
          },
          {
            icon: 'encryption',
            title: 'End-to-end encryption',
            body: 'Encrypted in transit and at rest (TLS, AES-256).',
          },
        ],
      },
      {
        title: 'Your data never trains AI',
        subtitle: 'Your content is used to serve you — never to train models.',
        cards: [
          {
            icon: 'noTrain',
            title: 'No training',
            body: 'Your data is never used to train an AI model.',
          },
          {
            icon: 'noRetention',
            title: 'Zero retention by models',
            body: 'You keep your data; our model providers retain none of it.',
          },
          {
            icon: 'isolation',
            title: 'Isolated per customer',
            body: 'The assistant draws only on your documents, isolated from other customers’.',
          },
        ],
      },
      {
        title: 'Granular access control, at every level',
        subtitle: 'Everyone in your network only accesses what concerns them.',
        cards: [
          {
            icon: 'sso',
            title: 'Enterprise SSO',
            body: 'Your teams sign in via your SSO (SAML).',
          },
          {
            icon: 'roles',
            title: 'Role-based access',
            body: 'Distinct rights for the franchisor and franchisees.',
          },
          {
            icon: 'permissions',
            title: 'Fine-grained permissions',
            body: 'You choose who accesses which documents across your teams.',
          },
        ],
      },
      {
        title: 'Compliance',
        subtitle: 'The European framework, minus the jargon.',
        cards: [
          {
            icon: 'gdpr',
            title: 'GDPR',
            body: 'Access, export and deletion of your data whenever you want.',
          },
          {
            icon: 'aiAct',
            title: 'EU AI Act',
            body: 'No AI evaluates, scores or ranks a person.',
          },
          {
            icon: 'doc',
            title: 'Documentation',
            body: 'DPA and detailed security measures available on request.',
          },
        ],
      },
    ],
    contact: {
      heading: 'A question about security?',
      body: 'Our team answers your security questionnaires and shares our detailed documentation on request.',
      cta: 'Request a demo',
    },
  },
};
