'use client'

import Link from 'next/link'
import { allBlogs } from 'contentlayer/generated'
import { compareDesc } from 'date-fns'
import { Typewriter } from 'react-simple-typewriter'
import { useState, useEffect } from 'react'

export default function Home() {
  const latestBlogs = allBlogs
    .sort((a, b) =>
      compareDesc(new Date(a.publishedAt), new Date(b.publishedAt))
    )
    .slice(0, 3)

  // State sequence: Hi → Name → About Me
  const [showHi, setShowHi] = useState(true)
  const [showName, setShowName] = useState(false)
  const [showAbout, setShowAbout] = useState(false)

  useEffect(() => {
    const hiTimeout = setTimeout(() => {
      setShowHi(false)
      setShowName(true)
    }, 2000) // Hi displays 2s

    const aboutTimeout = setTimeout(() => {
      setShowAbout(true)
    }, 4200) // About Me shows after name typing + delay (~2.2s + 0.8s + buffer)

    return () => {
      clearTimeout(hiTimeout)
      clearTimeout(aboutTimeout)
    }
  }, [])

  return (
    <div className="flex flex-col">
      {/* ================= HERO ================= */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32 text-center">
        {/* Hi + waving hand */}
        {showHi && (
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 animate-fade-in">
            Hi{' '}
            <span className="inline-block animate-wave origin-bottom-right">👋</span>
          </h1>
        )}

        {/* Typed Name */}
        {showName && (
          <h2 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6
                     bg-gradient-to-r from-primary via-primary/90 to-primary/70
                     bg-clip-text text-transparent drop-shadow-[0_0_25px_rgba(59,130,246,0.35)]
                     animate-fade-in">
            <Typewriter
              words={["I'm Boualleiguie Adam Isslem"]}
              cursor
              cursorStyle="▍"
              typeSpeed={70}
            />
          </h2>
        )}

        {/* Subtitle */}
        {showName && (
          <p className="text-xl sm:text-2xl text-muted-foreground mb-6 max-w-4xl mx-auto leading-relaxed animate-fade-in delay-200">
            Senior DevOps · DevSecOps · SysOps Engineer
          </p>
        )}

        {/* Description */}
        {showName && (
          <p className="text-lg text-muted-foreground mb-10 max-w-3xl mx-auto leading-relaxed animate-fade-in delay-300">
            I design, automate, secure, and operate production-grade infrastructures.
            This space is my living knowledge base — real projects, deep dives, and
            continuous learning across DevOps, Cloud, Kubernetes, and Security.
          </p>
        )}

        {/* CTAs */}
        {showName && (
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in delay-400">
            <Link
              href="/docs"
              className="px-8 py-3.5 bg-primary text-primary-foreground rounded-lg
                       hover:bg-primary/90 transition-all duration-200 font-medium
                       shadow-lg hover:shadow-xl hover:scale-105"
            >
              Explore Documentation
            </Link>

            <a
              href="/assets/general/pdfs/cv.pdf"
              download
              className="px-8 py-3.5 border-2 border-border rounded-lg
                       hover:bg-accent transition-all duration-200 font-medium
                       hover:border-primary/50"
            >
              Download CV
            </a>
          </div>
        )}
      </section>

      {/* ================= ABOUT ================= */}
      {showAbout && (
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">
              Engineer by Practice, Learner by Nature
            </h2>

            <p className="text-muted-foreground text-lg leading-relaxed">
              I’m a senior engineer with strong hands-on experience in automating,
              managing, and securing complex systems — from bare-metal and hypervisors
              to cloud-native and Kubernetes-based platforms.
              <br /><br />
              I enjoy the full IT spectrum: performance tuning, CI/CD architecture,
              GitOps workflows, Kubernetes operations, and security-first system design.
              Everything you see here is built from real production experience.
            </p>
          </div>
        </section>
      )}

      {/* ================= SKILLS ================= */}
      {showAbout && (
        <section className="bg-muted/30 py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl sm:text-4xl font-bold mb-12 text-center">
              What I Master
            </h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  title: 'CI/CD & Automation',
                  desc: 'Advanced GitLab CI/CD pipelines for monorepos, multi-platform builds, self-hosted runners, and resilient automation workflows.',
                },
                {
                  title: 'Kubernetes & GitOps',
                  desc: 'Production-grade Kubernetes clusters with GitOps using ArgoCD, FluxCD, and Fleet for scalable deployments.',
                },
                {
                  title: 'Cloud & Hypervisors',
                  desc: 'Rancher-managed clusters, Longhorn storage, Proxmox & Harvester (HCI) for enterprise virtualization.',
                },
                {
                  title: 'Infrastructure as Code',
                  desc: 'Terraform + Ansible for fully automated infrastructure provisioning and cluster bootstrap.',
                },
                {
                  title: 'DevSecOps & SSDLC',
                  desc: 'Security-first pipelines with SonarQube, Trivy, Harbor, NeuVector, and real penetration testing practices.',
                },
                {
                  title: 'Networking & Linux',
                  desc: 'Deep understanding of networking, firewalls, system hardening, and Linux administration.',
                },
              ].map((skill) => (
                <div
                  key={skill.title}
                  className="group p-6 border border-border rounded-xl bg-background
               hover:border-primary/50 hover:bg-accent/50
               transition-all duration-300
               hover:shadow-lg hover:-translate-y-1"
                >
                  <h3 className="text-xl font-semibold mb-3 transition-colors group-hover:text-primary">{skill.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {skill.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ================= BLOG ================= */}
      {showAbout && latestBlogs.length > 0 && (
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <h2 className="text-3xl sm:text-4xl font-bold mb-12 text-center">
            Latest Blog Posts
          </h2>

          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            {latestBlogs.map((blog) => (
              <Link
                key={blog._id}
                href={blog.url}
                className="group p-6 border border-border rounded-xl hover:border-primary/50 hover:bg-accent/50 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
              >
                <h3 className="text-xl font-semibold mb-3 group-hover:text-primary transition-colors">
                  {blog.title}
                </h3>
                <p className="text-muted-foreground mb-4 line-clamp-2">
                  {blog.description}
                </p>
                <time className="text-sm text-muted-foreground">
                  {new Date(blog.publishedAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </time>
              </Link>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-medium transition-colors group"
            >
              View all posts
              <span className="group-hover:translate-x-1 transition-transform">
                →
              </span>
            </Link>
          </div>
        </section>
      )}
    </div>
  )
}
