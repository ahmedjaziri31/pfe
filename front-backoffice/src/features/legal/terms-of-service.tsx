import LegalLayout from './legal-layout'

export default function TermsOfServicePage() {
  return (
    <LegalLayout title='Terms of Service'>
      <p className='mb-4 text-muted-foreground'>
        Last updated:{' '}
        {new Date().toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })}
      </p>

      <h2>1. Acceptance of Terms</h2>
      <p>
        By accessing and using the Admin Portal (the "Service"), you accept and
        agree to be bound by the terms and provision of this agreement. If you
        do not agree to abide by these terms, please do not use this Service.
      </p>

      <h2>2. Service Description</h2>
      <p>
        The Service provides administrative functionalities for Korpor Invest.
        You agree to use this Service only for its intended purposes and in
        compliance with all applicable laws and regulations.
      </p>

      <h2>3. User Accounts</h2>
      <p>
        When you create an account with us, you must provide information that is
        accurate, complete, and current at all times. Failure to do so
        constitutes a breach of the Terms, which may result in immediate
        termination of your account on our Service. You are responsible for
        safeguarding the password that you use to access the Service and for any
        activities or actions under your password.
      </p>

      <h2>4. Intellectual Property</h2>
      <p>
        The Service and its original content, features, and functionality are
        and will remain the exclusive property of Korpor and its licensors. The
        Service is protected by copyright, trademark, and other laws of both
        Tunisia and foreign countries.
      </p>

      <h2>5. Termination</h2>
      <p>
        We may terminate or suspend your account immediately, without prior
        notice or liability, for any reason whatsoever, including without
        limitation if you breach the Terms.
      </p>

      <h2>6. Limitation of Liability</h2>
      <p>
        In no event shall Korpor, nor its directors, employees, partners,
        agents, suppliers, or affiliates, be liable for any indirect,
        incidental, special, consequential or punitive damages, including
        without limitation, loss of profits, data, use, goodwill, or other
        intangible losses, resulting from your access to or use of or inability
        to access or use the Service.
      </p>

      <h2>7. Changes to Terms</h2>
      <p>
        We reserve the right, at our sole discretion, to modify or replace these
        Terms at any time. We will try to provide at least 30 days' notice prior
        to any new terms taking effect. What constitutes a material change will
        be determined at our sole discretion.
      </p>

      <h2>8. Contact Us</h2>
      <p>
        If you have any questions about these Terms, please contact us at
        Contact@korpor.com.
      </p>
    </LegalLayout>
  )
}
