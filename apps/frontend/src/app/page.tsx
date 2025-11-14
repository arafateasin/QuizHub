import Link from "next/link";
import { ArrowRight, BookOpen, Trophy, Zap, Users } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <BookOpen className="w-8 h-8 text-primary-600" />
              <span className="text-2xl font-heading font-bold text-gradient">
                QuizHub
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/auth/login"
                className="text-gray-700 hover:text-primary-600 transition-colors"
              >
                Login
              </Link>
              <Link href="/auth/signup" className="btn-primary">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-50 via-white to-secondary-50 pt-20 pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center animate-fade-in">
            <h1 className="text-5xl md:text-6xl font-heading font-bold text-gray-900 mb-6">
              Test Your Knowledge,
              <br />
              <span className="text-gradient">Level Up Your Skills</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Join QuizHub and challenge yourself with thousands of quizzes.
              Earn XP, unlock badges, and compete with friends!
            </p>
            <div className="flex justify-center space-x-4">
              <Link
                href="/auth/signup"
                className="btn-primary text-lg px-8 py-3"
              >
                Start Quiz Journey
                <ArrowRight className="inline-block ml-2 w-5 h-5" />
              </Link>
              <Link href="/quizzes" className="btn-secondary text-lg px-8 py-3">
                Browse Quizzes
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-heading font-bold text-center mb-12">
            Why Choose QuizHub?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Zap className="w-12 h-12 text-primary-600" />}
              title="Gamified Learning"
              description="Earn XP, level up, and unlock badges as you complete quizzes. Make learning fun and addictive!"
            />
            <FeatureCard
              icon={<Trophy className="w-12 h-12 text-primary-600" />}
              title="Compete & Win"
              description="Challenge friends, climb leaderboards, and prove you're the ultimate quiz master!"
            />
            <FeatureCard
              icon={<Users className="w-12 h-12 text-primary-600" />}
              title="AI-Powered Feedback"
              description="Get personalized insights and recommendations to improve your knowledge gaps."
            />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-secondary-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <StatCard number="10,000+" label="Quizzes Available" />
            <StatCard number="50,000+" label="Active Users" />
            <StatCard number="1M+" label="Questions Answered" />
            <StatCard number="100+" label="Categories" />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-heading font-bold mb-6">
            Ready to Start Your Quiz Journey?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Join thousands of learners and start testing your knowledge today!
          </p>
          <Link
            href="/auth/signup"
            className="btn-primary text-lg px-8 py-3 inline-flex items-center"
          >
            Create Free Account
            <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <BookOpen className="w-6 h-6 text-primary-400" />
                <span className="text-xl font-heading font-bold text-white">
                  QuizHub
                </span>
              </div>
              <p className="text-sm">
                Test your knowledge and compete with others in this gamified
                quiz platform.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-4">Product</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/quizzes">Browse Quizzes</Link>
                </li>
                <li>
                  <Link href="/leaderboard">Leaderboard</Link>
                </li>
                <li>
                  <Link href="/badges">Badges</Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-4">Company</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/about">About Us</Link>
                </li>
                <li>
                  <Link href="/contact">Contact</Link>
                </li>
                <li>
                  <Link href="/careers">Careers</Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-4">Legal</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/privacy">Privacy Policy</Link>
                </li>
                <li>
                  <Link href="/terms">Terms of Service</Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
            <p>&copy; 2025 QuizHub. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="p-6 bg-gray-50 rounded-xl card-hover">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-heading font-bold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}

function StatCard({ number, label }: { number: string; label: string }) {
  return (
    <div>
      <div className="text-4xl font-bold mb-2">{number}</div>
      <div className="text-primary-100">{label}</div>
    </div>
  );
}
