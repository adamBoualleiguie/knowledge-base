# LinkedIn Profile — Career Content

Use the sections below to fill your **LinkedIn profile**: headline, about, and experience entries. Copy-paste and adjust wording to fit character limits and your style.

---

## Profile headline (e.g. 220 characters)

**Option A (technical):**  
DevOps & SysOps Engineer | Kubernetes, GitLab CI/CD, Rancher, Terraform | SSDLC, SAST/DAST, GitOps (Argo CD) | 5+ years scaling platforms for banking, e‑commerce & mobile

**Option B (outcome-focused):**  
DevOps & Infrastructure Engineer | From 100+ to 1,000+ projects under one governance | CI/CD, Kubernetes, security automation & disaster recovery | Banking, telecom, e‑commerce

**Option C (short):**  
DevOps & SysOps Engineer · Kubernetes · GitLab · Security automation · 5+ years

---

## About / Summary (paste in “About” section)

I design and run **DevOps, platform, and security automation** so teams can ship often without breaking things or breaking the rules.

Over the past five years I’ve worked in **technology governance**, **SysOps**, and **consultancy**: self‑managed GitLab (100+ then 1,000+ projects), standardized CI/CD with reusable templates, SAST/DAST and license compliance, and Kubernetes at scale (Rancher, Longhorn, Velero, Argo CD). I’ve led **ransomware recovery**, cut client infra setup from days to hours with ProxGen and Kubespray, and built GitOps and automation for banking (QIIB), e‑commerce (GreenCodes), and mobile (Injazat, Diag IT).

I care about **governance that enables** (safe defaults, clear pipelines, audit trails), **infrastructure as code** (Terraform, Ansible, Git), and **resilience** (DR, backups, incident response). I’m comfortable between “how it should be done” (TGO) and “how it runs in the datacenter” (IT), and I like turning that into automation and documentation others can use.

---

## Experience entries (for “Experience” on LinkedIn)

### 1. GreenCodes Digital Core — Infrastructure & Automation Engineer (Consultancy)

**Location:** Sousse, Tunisia  
**Dates:** Feb. 2025 – Jun. 2025  
**Type:** Full-time or Contract (adjust as needed)

**Description (short):**  
Consultancy role: design and build production-grade Kubernetes, GitOps, and automation for multiple e‑commerce and business clients.

**Bullets (copy into LinkedIn):**

- Designed and built a production-grade, highly available Kubernetes platform using Rancher, Longhorn, and Velero for automated disaster recovery of cluster state and application data.
- Hardened security with Falco runtime detection and integrated Nginx Proxy Manager and cloudflared tunnel operators for secure service exposure without opening inbound ports.
- Established a GitOps delivery pipeline with Argo CD, managing client-specific stacks (PrestaShop, WordPress, Saleor) isolated via GitLab groups for repeatable, multi-tenant deployments.
- Deployed ERPNext in multi-tenant mode with custom Frappe modules so each business had an isolated instance with centralised management.
- Implemented a global notification system (Gotifier) for incidents, attacks, and downtime to enable rapid response across all client environments.
- Built AI-powered WhatsApp automation (WAHA API + n8n): workflows read product data from Google Drive, auto-reply to customers, create orders in ERPNext, and notify production—reducing manual work and order-to-fulfilment delays.
- Developed an MCP ERPNext AI assistant so employees can query sales, customers, and inventory in natural language, boosting internal productivity.
- Delivered end-to-end automation that improved operational efficiency by ~70% across multiple e‑commerce clients, with faster response times and less manual data entry.

---

### 2. Proxym IT — SysOps Engineer (IT Team)

**Location:** Tunisia  
**Dates:** Jan. 2023 – Jan. 2025  

**Description (short):**  
Bridge between Technology Governance (TGO) and IT: platform upgrades, client infrastructure automation, Kubernetes governance, and incident response (including ransomware recovery).

**Bullets:**

- Acted as liaison between TGO (governance, DevOps) and IT (servers, hypervisors): upgraded GitLab and SonarQube and automated client infrastructure (e.g. Bankerise at La Poste Tunisie) for production-ready, banking-grade environments.
- Led Rancher-based Kubernetes governance: Rancher HA, vSphere integration, Longhorn storage, RBAC, OPA policies and admission hooks, and Velero backups to S3 with DR plans.
- Created ProxGen: Terraform + cloud-init in GitLab with centralised tfstate so operators provision VMs in Proxmox/vSphere in ~1 minute (replacing 30+ min manual setups). [GitHub: ProxGen]
- With the IT team, reduced client environment preparation from ~2 days to ~1.5 hours using ProxGen, Kubespray, Ansible, and operators (Keycloak, Redis, ECK); less config drift and stronger DR readiness.
- Contributed to 24-hour recovery from a ransomware (Akira) incident: identified and isolated source, applied remediations, and rolled out AdGuard across the company for DNS hardening.
- Supported La Poste Tunisie production infrastructure: full automation with ProxGen, Kubespray, ECK, and Longhorn in coordination with the client team.

---

### 3. Proxym IT — DevOps Engineer (Technology Governance Office, TGO)

**Location:** Tunisia  
**Dates:** Mar. 2021 – Dec. 2022  

**Description (short):**  
DevOps, technology governance, and software architecture for banking, insurance, and other projects; 100+ projects on a self-managed GitLab instance.

**Bullets:**

- Managed DevOps, technology, and software architecture for multiple projects (banking, insurance, web and mobile) across 100+ projects on a self-managed GitLab instance.
- Led artifact and license compliance: integrated SonarQube License Check into GitLab pipelines to monitor third-party licenses (JSON lock, POMs) and avoid compliance issues with vendors and clients.
- Standardized CI/CD across 1,000+ projects with reusable GitLab CI templates and components for Java, Node.js, and container-based pipelines, eliminating error-prone copy-paste and ensuring consistent delivery.
- Enforced pre-commit Git hooks (e.g. Gitleaks) to detect and block secrets and insecure code before merge, reducing sensitive data leaks and raising developer awareness.
- Integrated SAST (SonarQube, Trivy, Hadolint) and automated DAST (OWASP ZAP, ArcherySec as ASOC) into CI/CD; centralised vulnerability management with DefectDojo for clearer audits and faster feedback.
- Drove Nexus management: proxy and cleanup policies, blob compaction, 200GB+ reclaimed, and migration to a newer Nexus version with blob conversion and reconciliation.
- Led GitLab self-hosted upgrades and runner strategy: Docker runners, MinIO distributed caches, and a dashboard for 200+ daily pipelines to detect bottlenecks and support governance.
- Delivered full CI/CD for legacy and mobile projects: WeHub (GitHub Actions, OVH) and Diag IT mobile (GitLab, Android/iOS build and publish).

---

### 4. Injazat — Mobile Delivery & Release Engineer (VCP)

**Location:** Remote (multinational team)  
**Dates:** Sep. 2021 – Jun. 2022  

**Description (short):**  
Bridge between development and delivery for mobile applications: Firebase, Bitrise, Bitbucket; multi-flavour Android and iOS releases.

**Bullets:**

- Synced development and delivery for mobile applications in a multinational team; managed Firebase, Bitbucket, and Bitrise for build, test, and production releases.
- Delivered multiple app flavours (Android and iOS), including AAB and iOS artefacts, with clear release and bug-reporting workflows.

---

### 5. Qatar International Islamic Bank (QIIB) — OpenShift & GitOps (Consultancy)

**Location:** Remote / Qatar  
**Dates:** Jan. 2024 – Apr. 2024  

**Description (short):**  
OpenShift platform and GitOps for preprod and staging; Argo CD and Sealed Secrets for resilient, production-ready and auditable deployments.

**Bullets:**

- Managed OpenShift clusters for preprod and staging environments in line with banking requirements.
- Implemented Argo CD for GitOps and Sealed Secrets for secure, Git-based secrets management.
- Ensured platform resilience and production readiness in coordination with the bank’s IT and security teams.

---

### 6. Research Internship — Network Simulation (NS-3)

**Location:** Germany  
**Dates:** Jan. 2020 – Apr. 2020  

**Description (short):**  
Four-month research internship: network simulation with NS-3 for a new mode of cellular network implementation.

**Bullets:**

- Used NS-3 to design and run simulation scenarios for cellular network behaviour and performance.
- Documented assumptions, parameters, and results for reproducibility and handover.

---

## Skills to add / highlight on LinkedIn

**Infrastructure & platform:** Kubernetes, Rancher, OpenShift, Proxmox, vSphere, Terraform, Ansible, Kubespray, Longhorn, Velero, Argo CD, GitOps  

**CI/CD & DevOps:** GitLab CI, GitHub Actions, Jenkins, Bitrise, SonarQube, Nexus, MinIO  

**Security & compliance:** SAST, DAST, Gitleaks, Trivy, Hadolint, OWASP ZAP, ArcherySec, DefectDojo, Sealed Secrets, Falco, OPA  

**Containers & runtime:** Docker, Kubernetes, ERPNext, PrestaShop, WordPress, Saleor  

**Cloud & automation:** AWS (EC2, IAM), OVH, cloudflared, n8n, WAHA, MCP  

**Soft / context:** Technology governance, incident response, DR, multi-team coordination, consultancy, documentation

---

## Optional: “Featured” or “About” one-liners

- Scaled CI/CD from 100 to 1,000+ projects under one governance model.
- Cut client infrastructure setup from 2 days to 1.5 hours with automation (ProxGen, Kubespray, operators).
- Recovered from a ransomware incident in ~24 hours using DR plans and team coordination.
- Built VM provisioning (ProxGen) so a new machine is ready in ~1 minute from a Git branch.
- Delivered ~70% operational efficiency gain for e‑commerce clients via platform and automation (GreenCodes).

Use what fits your tone and space; trim or merge bullets as needed for LinkedIn’s limits.
