# Sanity CMS Migration Documentation Index

Quick reference to all Sanity migration and studio documentation.

---

## 📋 Migration Guides

### [MIGRATION_SETUP_GUIDE.md](migration/MIGRATION_SETUP_GUIDE.md)

**Purpose:** Step-by-step guide for running content migration scripts  
**Use when:** You're ready to migrate content from TypeScript files to Sanity  
**Key info:** How to run migration scripts, what gets migrated, troubleshooting

### [scripts/README-migration.md](../../scripts/README-migration.md)

**Purpose:** Detailed documentation for migration scripts  
**Use when:** You need to understand individual migration scripts  
**Key info:** Script usage, options, validation, recovery

---

## 📊 Status & Verification

### [SANITY_MIGRATION_STATUS.md](sanity/SANITY_MIGRATION_STATUS.md)

**Purpose:** Overall migration progress and remaining tasks  
**Use when:** You want to see what's done and what's left  
**Key info:** Task completion status, progress summary, next steps

### [SCHEMA_VERIFICATION_REPORT.md](sanity/SCHEMA_VERIFICATION_REPORT.md)

**Purpose:** Schema verification before migration  
**Use when:** You want to verify schemas are ready  
**Key info:** Schema coverage, field mappings, validation checklist

### [HOW_TO_CREATE_INTERNAL_LINKS.md](sanity/HOW_TO_CREATE_INTERNAL_LINKS.md)

**Purpose:** Guide for creating internal links in Sanity Studio articles  
**Use when:** Adding links to article content  
**Key info:** Step-by-step instructions for creating internal and external links

---

## 🎨 Studio Documentation

### [apps/studio/README.md](../../apps/studio/README.md)

**Purpose:** Studio overview and quick start  
**Use when:** You need basic studio information  
**Key info:** Quick start, environment variables, deployment overview

### [apps/studio/DEPLOYMENT.md](../../apps/studio/DEPLOYMENT.md)

**Purpose:** Complete deployment guide for `studio.vitalicesf.com`  
**Use when:** Deploying studio to Vercel  
**Key info:** Vercel settings, Cloudflare DNS, environment variables, troubleshooting

### [apps/studio/ENV_SECURITY.md](../../apps/studio/ENV_SECURITY.md)

**Purpose:** Environment variables security guide  
**Use when:** Understanding which variables are public vs. private  
**Key info:** Public vs. private variables, security best practices

### [apps/studio/SECURITY.md](../../apps/studio/SECURITY.md)

**Purpose:** Basic Auth and security configuration  
**Use when:** Setting up production security  
**Key info:** Basic Auth setup, security headers, testing

---

## 📚 Design & Requirements

### [.kiro/specs/sanity-cms-migration/requirements.md](../../.kiro/specs/sanity-cms-migration/requirements.md)

**Purpose:** Complete requirements specification  
**Use when:** Understanding project requirements  
**Key info:** All 12 requirements with acceptance criteria

### [.kiro/specs/sanity-cms-migration/design.md](../../.kiro/specs/sanity-cms-migration/design.md)

**Purpose:** Technical design document  
**Use when:** Understanding architecture and implementation  
**Key info:** Architecture, schemas, data models, testing strategy

### [.kiro/specs/sanity-cms-migration/tasks.md](../../.kiro/specs/sanity-cms-migration/tasks.md)

**Purpose:** Implementation task list  
**Use when:** Tracking implementation progress  
**Key info:** All tasks with requirements mapping

---

## 🚀 Quick Links

### Getting Started

1. Read [MIGRATION_SETUP_GUIDE.md](migration/MIGRATION_SETUP_GUIDE.md) to understand the migration process
2. Check [SCHEMA_VERIFICATION_REPORT.md](sanity/SCHEMA_VERIFICATION_REPORT.md) to verify schemas
3. Run migration: `npm run migrate:content`

### Deployment

1. Read [apps/studio/DEPLOYMENT.md](../../apps/studio/DEPLOYMENT.md) for Vercel setup
2. Configure environment variables (see [apps/studio/ENV_SECURITY.md](../../apps/studio/ENV_SECURITY.md))
3. Set up Cloudflare DNS

### Status Tracking

- Check [SANITY_MIGRATION_STATUS.md](sanity/SANITY_MIGRATION_STATUS.md) for overall progress
- Review [.kiro/specs/sanity-cms-migration/tasks.md](../../.kiro/specs/sanity-cms-migration/tasks.md) for detailed task list

---

## 📁 File Locations

```
vital-ice/
├── docs/
│   ├── migration/
│   │   └── MIGRATION_SETUP_GUIDE.md          # Migration how-to guide
│   ├── sanity/
│   │   ├── SANITY_MIGRATION_STATUS.md         # Progress tracking
│   │   ├── SCHEMA_VERIFICATION_REPORT.md     # Schema verification
│   │   └── HOW_TO_CREATE_INTERNAL_LINKS.md   # Link creation guide
│   └── SANITY_MIGRATION_INDEX.md             # This file
├── apps/studio/
│   ├── README.md                     # Studio overview
│   ├── DEPLOYMENT.md                 # Deployment guide
│   ├── ENV_SECURITY.md               # Environment security
│   └── SECURITY.md                   # Basic Auth config
├── scripts/
│   └── README-migration.md           # Migration scripts docs
└── .kiro/specs/sanity-cms-migration/
    ├── requirements.md                # Requirements spec
    ├── design.md                      # Design document
    └── tasks.md                       # Task list
```

---

**Last Updated:** $(date)
