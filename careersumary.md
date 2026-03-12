# Career Summary — Adam Boualleiguie

This document is a **structured overview** of my career phases, missions, and projects from **2020 to 2026**. The same content is published as ordered career entries in the site’s **Career & Certifications** section (MDX in `content/careers/`). Dates below are indicative; exact dates are maintained in each career MDX file.

---

## 2020 — Early career

- **Research internship (Germany)** — 4 months  
  Network simulation with **NS-3** for a new mode of cellular network implementation. Foundation in research, simulation workflows, and delivering on a timeline.

---

## 2021 — Proxym IT, Technology Governance Office (TGO)

- **DevOps Engineer, TGO**  
  Governance, DevOps, and software architecture for banking, insurance, and other projects (web and mobile). Managed **100+ projects** on a self-managed GitLab instance; deployment, pipelines, and standards at scale.

- **Artifact & license compliance**  
  SonarQube License Check integration ([sonarqube-licensecheck](https://github.com/porscheinformatik/sonarqube-licensecheck)) in GitLab pipelines to monitor third-party licenses (JSON lock, POMs) and avoid compliance issues with vendors and clients.

---

## 2021–2022 — Broader TGO scope

- **Injazat VCP**  
  Syncing dev and delivery for **mobile apps** (Firebase, Bitbucket, Bitrise). Multi-flavour Android/iOS, AAB, testing, and production releases in a multinational team.

- **DockerIOs**  
  Virtualized **macOS CI runners** (Docker-OSX, QEMU, Docker) on Proxmox to scale iOS builds without scaling Mac Mini hardware.

- **SSDLC implementation**  
  Standardized CI/CD across **1,000+ projects**: reusable GitLab CI templates (Java, Node.js, containers), Gitleaks pre-commit hooks, SAST (SonarQube, Trivy, Hadolint), DAST (OWASP ZAP, ArcherySec), DefectDojo for vulnerability aggregation and audit support.

- **WeHub**  
  Legacy project modernized with **GitHub Actions** and deployment to **OVH**.

- **Diag IT (Viola / MTA3)**  
  Full **GitLab CI/CD** for [Diag IT](https://solutions.diag-it.fr/) mobile apps (Android & iOS): build, test, publish.

- **Nexus**  
  Proxies, cleanup/compaction policies, **200GB+** reclaimed, and migration to a newer Nexus version (blob conversion and reconciliation).

- **GitLab self-hosted & runners**  
  Upgrades, Docker runners, **MinIO** distributed caches, and a **dashboard** for **200+ daily pipelines** (bottlenecks, visibility for DevOps and governance).

---

## 2022–2023 — La Poste Tunisie (cross-role)

- **DevOps (TGO)**  
  CI/CD, repo governance, Bankerise adaptation, mobile pipelines (Android/iOS), delivery to La Poste servers via Jenkins.

- **SysOps (IT)**  
  Production infrastructure with La Poste team: **ProxGen**, **Kubespray**, **ECK**, **Longhorn** — full automation from provisioning to production-ready env.

---

## 2023 — Proxym IT, SysOps (IT team)

- **SysOps Engineer**  
  Bridge between TGO (governance, DevOps) and IT (servers, hypervisors). Upgraded GitLab, SonarQube; automated client infra (e.g. Bankerise); improved resilience.

- **Rancher & K8s governance**  
  Rancher HA, vSphere integration, auto-provisioned VMs, **Longhorn** (replacing NFS), **RBAC**, **OPA** policies and admission hooks, **Velero** to S3 and DR plans.

- **ProxGen**  
  **Cloud-init** + **Terraform** in GitLab (central tfstate). Operators create a branch with tfvars (OS, CPU, RAM, IP) and get a VM in **~1 minute** in Proxmox/vSphere. [ProxGen on GitHub](https://github.com/adamBoualleiguie/ProxGen).

- **Total infra automation (Kubespray, Longhorn, ECK)**  
  With IT, reduced client env preparation from **~2 days to ~1.5 hours**: ProxGen for VMs, hardened **Kubespray**, Ansible (Velero, etc.), **Keycloak**, **Redis**, **ECK** operators; less drift, more stability and DR readiness.

- **Ransomware (Akira) remediation**  
  Zero-day led to encrypted data in one DC. **Recovery in ~24 hours** using DR plans and coordination; identified and isolated source, applied fixes, rolled out **AdGuard** company-wide.

---

## 2024 — QIIB & freelance

- **QIIB (Qatar International Islamic Bank)**  
  **OpenShift** (preprod, staging), **Argo CD**, **Sealed Secrets** for resilient, production-ready and GitOps-friendly platform.

- **Freelance — GitHub Actions & AWS**  
  Next.js project: **GitHub Actions** for CI and code quality, automatic deployment, **AWS** (EC2, IAM) provisioning (e.g. Terraform).

---

## 2025 — GreenCodes Digital Core

- **Infrastructure & Automation Engineer (consultancy)** — Feb.–Jun. 2025, Sousse  
  Production-grade **Kubernetes** (Rancher, Longhorn, Velero), **Falco**, Nginx Proxy Manager / **cloudflared**, **Argo CD**, GitOps for PrestaShop/WordPress/Saleor. **ERPNext** multi-tenant; **Gotifier** for alerts; **WAHA + n8n** for WhatsApp automation (orders, ERPNext); **MCP ERPNext AI** assistant. **~70%** operational efficiency improvement across e‑commerce clients.

---

## File mapping

| Phase / project           | Career MDX file                              |
|---------------------------|----------------------------------------------|
| 2020 Internship (NS3)     | `internship-ns3-2020.mdx`                    |
| Proxym TGO (DevOps)       | `proxym-it-tgo-devops.mdx`                   |
| Injazat VCP               | `injazat-vcp-mobile.mdx`                     |
| DockerIOs                  | `dockerios-virtualized-macos-runners.mdx`   |
| Proxym SysOps             | `proxym-it-sysops.mdx`                       |
| QIIB OpenShift            | `qiib-openshift-argo.mdx`                    |
| GreenCodes                | `greencodes-infrastructure-automation.mdx`   |
| Freelance (GitHub + AWS)  | `freelance-github-actions-aws.mdx`           |

Edit dates and details in the MDX files; this summary can be kept in sync for reference.
