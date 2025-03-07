import Hero from "@/components/hero";
import Navbar from "@/components/navbar";
import PricingCard from "@/components/pricing-card";
import Footer from "@/components/footer";
import { createClient } from "../../supabase/server";
import {
  ArrowUpRight,
  Database,
  FileText,
  Globe,
  MessageSquare,
  Shield,
  Zap,
  BarChart,
  Users,
  Settings,
} from "lucide-react";
import Link from "next/link";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: plans, error } = await supabase.functions.invoke(
    "supabase-functions-get-plans",
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <Navbar />
      <Hero />

      {/* Features Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">
              Powerful RAG Platform Features
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our comprehensive platform enables organizations to create,
              customize, and manage AI-powered chatbots with advanced retrieval
              capabilities.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <MessageSquare className="w-6 h-6" />,
                title: "Intelligent Chatbots",
                description:
                  "Create customized AI assistants with RAG capabilities for each department",
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
              <div
                key={index}
                className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="text-blue-600 mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">How It Works</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our platform makes it easy to deploy powerful AI chatbots across
              your organization
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12 max-w-5xl mx-auto">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <FileText className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">
                1. Connect Your Data
              </h3>
              <p className="text-gray-600">
                Upload documents, connect to URLs, or integrate with your
                existing databases
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <Settings className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">
                2. Configure Your Chatbot
              </h3>
              <p className="text-gray-600">
                Customize LLM parameters, set access permissions, and assign
                data sources
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <Globe className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">
                3. Deploy & Analyze
              </h3>
              <p className="text-gray-600">
                Launch your chatbot and gain insights through our comprehensive
                analytics dashboard
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-blue-600 text-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">99.9%</div>
              <div className="text-blue-100">Uptime Guaranteed</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">500+</div>
              <div className="text-blue-100">Enterprise Clients</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">10M+</div>
              <div className="text-blue-100">Documents Processed</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">50+</div>
              <div className="text-blue-100">Data Integrations</div>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Powerful Use Cases</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our platform adapts to various business needs across departments
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                title: "Customer Support",
                description:
                  "Reduce response times and improve satisfaction with AI-powered support chatbots that access your knowledge base",
                icon: <Users className="w-6 h-6" />,
              },
              {
                title: "Internal Knowledge Management",
                description:
                  "Help employees quickly find information across internal documents, wikis, and databases",
                icon: <Database className="w-6 h-6" />,
              },
              {
                title: "Compliance & Legal",
                description:
                  "Ensure accurate responses based on the latest regulatory documents and legal guidelines",
                icon: <Shield className="w-6 h-6" />,
              },
              {
                title: "Sales Enablement",
                description:
                  "Equip your sales team with instant access to product information, pricing, and competitive intelligence",
                icon: <Zap className="w-6 h-6" />,
              },
              {
                title: "HR & Onboarding",
                description:
                  "Streamline employee onboarding and answer common HR questions automatically",
                icon: <Users className="w-6 h-6" />,
              },
              {
                title: "Research & Development",
                description:
                  "Accelerate innovation by providing researchers with AI-assisted access to relevant documents and data",
                icon: <Globe className="w-6 h-6" />,
              },
            ].map((useCase, index) => (
              <div
                key={index}
                className="p-6 bg-white rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all"
              >
                <div className="text-blue-600 mb-4">{useCase.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{useCase.title}</h3>
                <p className="text-gray-600">{useCase.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-24 bg-gray-50" id="pricing">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Choose the perfect plan for your organization's needs. Scale as
              you grow.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {plans?.map((item: any) => (
              <PricingCard key={item.id} item={item} user={user} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white border-t border-gray-100">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Transform Your Knowledge Management?
          </h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Join leading organizations that use our platform to make their
            information accessible and actionable.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/dashboard"
              className="inline-flex items-center px-6 py-3 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Get Started Now
              <ArrowUpRight className="ml-2 w-4 h-4" />
            </Link>
            <Link
              href="#pricing"
              className="inline-flex items-center px-6 py-3 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              View Pricing
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
