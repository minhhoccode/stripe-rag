import Hero from "@/components/hero";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { MessageSquare, Database, Shield, BarChart } from "lucide-react";
import Link from "next/link";

export default function StoryboardHome() {
  return (
    <div className="min-h-screen bg-background">
      <nav className="w-full bg-card">
        <div className="nav-container container-xl">
          <div className="flex items-center">
            <div className="text-xl font-bold flex items-center">
              <MessageSquare className="h-6 w-6 mr-2 feature-icon" />
              <span>RAGify</span>
            </div>
            <div className="hidden md:flex ml-10 space-x-8">
              <span className="nav-link">Features</span>
              <span className="nav-link">Solutions</span>
              <span className="nav-link">Pricing</span>
              <span className="nav-link">Resources</span>
            </div>
          </div>
          <div className="flex gap-4 items-center">
            <span className="nav-link px-3 py-2">Sign In</span>
            <span className="primary-button text-sm px-4 py-2">Sign Up</span>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative overflow-hidden bg-background">
        <div className="absolute inset-0 hero-gradient" />

        <div className="relative hero-container">
          <div className="container-xl">
            <div className="badge badge-primary mb-6 mx-auto w-fit">
              The Ultimate RAG Platform
            </div>

            <div className="text-center max-w-4xl mx-auto">
              <h1 className="hero-title">
                AI-Powered{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(var(--chart-2))]">
                  RAG Chatbots
                </span>{" "}
                for Your Enterprise
              </h1>

              <p className="hero-subtitle">
                Create, customize, and manage intelligent chatbots with
                Retrieval Augmented Generation across your organization.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <span className="primary-button">Get Started Free</span>

                <span className="secondary-button">View Pricing</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <section className="section-spacing bg-card">
        <div className="container-xl">
          <div className="text-center">
            <h2 className="section-title">Powerful RAG Platform Features</h2>
            <p className="section-description">
              Our comprehensive platform enables organizations to create,
              customize, and manage AI-powered chatbots.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <MessageSquare className="w-6 h-6" />,
                title: "Intelligent Chatbots",
                description:
                  "Create customized AI assistants with RAG capabilities",
              },
              {
                icon: <Database className="w-6 h-6" />,
                title: "Data Integration",
                description:
                  "Connect to multiple data sources including documents, URLs, and databases",
              },
              {
                icon: <Shield className="w-6 h-6" />,
                title: "Enterprise Security",
                description:
                  "End-to-end encryption with role-based access control",
              },
              {
                icon: <BarChart className="w-6 h-6" />,
                title: "Advanced Analytics",
                description:
                  "Comprehensive insights into chatbot performance and usage",
              },
            ].map((feature, index) => (
              <div key={index} className="feature-card">
                <div className="feature-icon mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="bg-secondary border-t border-border py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          © {new Date().getFullYear()} RAGify. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
