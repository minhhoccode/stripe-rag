import Hero from "@/components/hero";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { MessageSquare, Database, Shield, BarChart } from "lucide-react";
import Link from "next/link";

export default function StoryboardHome() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <nav className="w-full border-b border-gray-200 bg-white py-4">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center">
            <div className="text-xl font-bold flex items-center">
              <MessageSquare className="h-6 w-6 mr-2 text-blue-600" />
              <span>RAGify</span>
            </div>
            <div className="hidden md:flex ml-10 space-x-8">
              <span className="text-sm font-medium text-gray-600 hover:text-gray-900">
                Features
              </span>
              <span className="text-sm font-medium text-gray-600 hover:text-gray-900">
                Solutions
              </span>
              <span className="text-sm font-medium text-gray-600 hover:text-gray-900">
                Pricing
              </span>
              <span className="text-sm font-medium text-gray-600 hover:text-gray-900">
                Resources
              </span>
            </div>
          </div>
          <div className="flex gap-4 items-center">
            <span className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900">
              Sign In
            </span>
            <span className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">
              Sign Up
            </span>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative overflow-hidden bg-white">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 opacity-70" />

        <div className="relative pt-24 pb-32 sm:pt-32 sm:pb-40">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-4xl mx-auto">
              <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 mb-8 tracking-tight">
                AI-Powered{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                  RAG Chatbots
                </span>{" "}
                for Your Enterprise
              </h1>

              <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
                Create, customize, and manage intelligent chatbots with
                Retrieval Augmented Generation across your organization.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <span className="inline-flex items-center px-8 py-4 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors text-lg font-medium">
                  Get Started Free
                </span>

                <span className="inline-flex items-center px-8 py-4 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-lg font-medium">
                  View Pricing
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">
              Powerful RAG Platform Features
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
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

      <footer className="bg-gray-50 border-t border-gray-100 py-8">
        <div className="container mx-auto px-4 text-center text-gray-600">
          © {new Date().getFullYear()} RAGify. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
