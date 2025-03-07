import Link from "next/link";
import {
  ArrowUpRight,
  Check,
  Database,
  MessageSquare,
  BarChart,
} from "lucide-react";

export default function Hero() {
  return (
    <div className="relative overflow-hidden bg-background">
      {/* Background gradient */}
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
              Create, customize, and manage intelligent chatbots with Retrieval
              Augmented Generation across your organization. Connect to your
              data sources and deliver accurate, context-aware responses.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/dashboard" className="primary-button">
                Get Started Free
                <ArrowUpRight className="ml-2 w-5 h-5" />
              </Link>

              <Link href="#pricing" className="secondary-button">
                View Pricing
              </Link>
            </div>

            <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
              <div className="flex flex-col items-center p-5 bg-card rounded-xl shadow-sm">
                <MessageSquare className="w-10 h-10 feature-icon mb-3" />
                <h3 className="font-semibold mb-1">Multi-Tenant Chatbots</h3>
                <p className="text-sm text-muted-foreground">
                  Deploy customized chatbots for each department
                </p>
              </div>
              <div className="flex flex-col items-center p-5 bg-card rounded-xl shadow-sm">
                <Database className="w-10 h-10 feature-icon mb-3" />
                <h3 className="font-semibold mb-1">Data Integration</h3>
                <p className="text-sm text-muted-foreground">
                  Connect to documents, URLs, and databases
                </p>
              </div>
              <div className="flex flex-col items-center p-5 bg-card rounded-xl shadow-sm">
                <BarChart className="w-10 h-10 feature-icon mb-3" />
                <h3 className="font-semibold mb-1">Advanced Analytics</h3>
                <p className="text-sm text-muted-foreground">
                  Track performance and user satisfaction
                </p>
              </div>
            </div>

            <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-green-500" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-green-500" />
                <span>14-day free trial</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-green-500" />
                <span>Cancel anytime</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
