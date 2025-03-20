import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';

export default function ConfirmationPage() {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        when: "beforeChildren",
        staggerChildren: 0.3
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  // Steps after applying
  const nextSteps = [
    {
      title: "Application Review",
      description: "Our team will review your application and resume within 7-10 business days."
    },
    {
      title: "Initial Interview",
      description: "If selected, you'll be invited for an initial video interview with the department team."
    },
    {
      title: "Technical Assessment",
      description: "Depending on the role, you may be asked to complete a technical assessment or case study."
    },
    {
      title: "Final Decision",
      description: "You'll be notified of our final decision, and if successful, we'll discuss onboarding details."
    }
  ];

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="text-center"
        >
          <motion.div variants={itemVariants} className="mb-8">
            <div className="flex justify-center">
              <div className="w-24 h-24 rounded-full bg-green-500/20 flex items-center justify-center mb-6">
                <CheckCircle className="h-12 w-12 text-green-500" />
              </div>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold mb-4">Application Submitted!</h1>
            <p className="text-gray-400 max-w-xl mx-auto">
              Thank you for applying to join our satellite team. We've received your application and will be in touch soon.
            </p>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="bg-gray-900/80 backdrop-blur-sm border-gray-800 mb-8">
              <CardContent className="p-8">
                <h2 className="text-xl font-bold mb-6">What Happens Next?</h2>
                
                <div className="space-y-6">
                  {nextSteps.map((step, index) => (
                    <div key={index} className="flex">
                      <div className="flex-shrink-0 mr-4">
                        <div className="w-8 h-8 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-500 font-bold">
                          {index + 1}
                        </div>
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-white">{step.title}</h3>
                        <p className="text-gray-400">{step.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-8 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                  <p className="text-sm text-blue-400">
                    <i className="fas fa-info-circle mr-2"></i>
                    You will receive a confirmation email shortly with details about your application.
                    Please check your spam folder if you don't see it in your inbox.
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
          
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild className="bg-blue-600 hover:bg-blue-700">
              <Link href="/">
                Return to Home
              </Link>
            </Button>
            
            <Button asChild variant="outline" className="border-gray-700 text-gray-300 hover:bg-gray-800">
              <Link href="/departments">
                Explore Other Departments
              </Link>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
