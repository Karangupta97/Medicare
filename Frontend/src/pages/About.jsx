import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const About = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
            About Medicare
          </h1>

          <div className="prose dark:prose-invert max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                Our Mission
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                At Medicare, we're dedicated to revolutionizing healthcare management
                by providing a seamless, secure, and user-friendly platform for
                managing medical records and healthcare services.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                Our Vision
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                We envision a future where healthcare information is easily accessible,
                securely managed, and efficiently shared between patients and healthcare
                providers, leading to better health outcomes for all.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                Our Values
              </h2>
              <ul className="list-disc pl-6 text-gray-600 dark:text-gray-400">
                <li>Patient Privacy and Security</li>
                <li>Innovation in Healthcare</li>
                <li>User-Centric Design</li>
                <li>Transparency and Trust</li>
                <li>Continuous Improvement</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                Our Services
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Digital Health Records
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Securely store and manage your medical records in one place.
                  </p>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Appointment Management
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Schedule and manage your medical appointments easily.
                  </p>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Prescription Tracking
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Keep track of your medications and prescriptions.
                  </p>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Health Analytics
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Get insights into your health data and trends.
                  </p>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                Our Team
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Our team consists of healthcare professionals, technology experts,
                and dedicated support staff working together to provide you with
                the best healthcare management experience.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                Contact Us
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Have questions or need assistance? Our support team is here to help:
                <br />
                Email: support@medicare.com
                <br />
                Phone: (555) 123-4567
                <br />
                Hours: Monday - Friday, 9:00 AM - 6:00 PM EST
              </p>
            </section>
          </div>

          <div className="mt-8 text-center">
            <Link
              to="/"
              className="text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
            >
              Back to Home
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default About; 