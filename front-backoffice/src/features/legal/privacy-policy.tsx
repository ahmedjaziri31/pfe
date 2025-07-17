import LegalLayout from './legal-layout'

export default function PrivacyPolicyPage() {
  return (
    <LegalLayout title='Privacy Policy'>
      <p className='mb-4 text-muted-foreground'>
        Last updated:{' '}
        {new Date().toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })}
      </p>

      <h2>1. Introduction</h2>
      <p>
        Welcome to Korpor's Privacy Policy. We are committed to protecting your
        personal data and respecting your privacy. This policy outlines how we
        collect, use, disclose, and safeguard your information when you use our
        Admin Portal (the "Service").
      </p>

      <h2>2. Information We Collect</h2>
      <p>
        We may collect personal identification information (Name, email address,
        phone number, etc.) when you register for an account or use our Service.
        We also collect non-personal identification information about Users
        whenever they interact with our Service, such as browser name, type of
        computer, and technical information about Users' means of connection to
        our Service.
      </p>

      <h2>3. How We Use Your Information</h2>
      <p>We may use the information we collect from you to:</p>
      <ul>
        <li>
          Personalize your experience and to allow us to deliver the type of
          content and product offerings in which you are most interested.
        </li>
        <li>Improve our Service in order to better serve you.</li>
        <li>Administer a contest, promotion, survey or other site feature.</li>
        <li>Process your transactions.</li>
        <li>
          Send periodic emails regarding your order or other products and
          services.
        </li>
      </ul>

      <h2>4. How We Protect Your Information</h2>
      <p>
        We adopt appropriate data collection, storage and processing practices
        and security measures to protect against unauthorized access,
        alteration, disclosure or destruction of your personal information,
        username, password, transaction information and data stored on our
        Service.
      </p>

      <h2>5. Sharing Your Personal Information</h2>
      <p>
        We do not sell, trade, or rent Users' personal identification
        information to others. We may share generic aggregated demographic
        information not linked to any personal identification information
        regarding visitors and users with our business partners, trusted
        affiliates and advertisers for the purposes outlined above.
      </p>

      <h2>6. Your Data Protection Rights</h2>
      <p>
        Depending on your location, you may have the following rights regarding
        your personal data: the right to access, the right to rectification, the
        right to erasure, the right to restrict processing, the right to object
        to processing, and the right to data portability. If you wish to
        exercise any of these rights, please contact us.
      </p>

      <h2>7. Changes to This Privacy Policy</h2>
      <p>
        Korpor has the discretion to update this privacy policy at any time.
        When we do, we will revise the updated date at the top of this page. We
        encourage Users to frequently check this page for any changes to stay
        informed about how we are helping to protect the personal information we
        collect.
      </p>

      <h2>8. Contacting Us</h2>
      <p>
        If you have any questions about this Privacy Policy, the practices of
        this site, or your dealings with this site, please contact us at:
        <br />
        Korpor
        <br />
        Djerba, Midoun, Tunisia
        <br />
        Contact@korpor.com
      </p>
    </LegalLayout>
  )
}
