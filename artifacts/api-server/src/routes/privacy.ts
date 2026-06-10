import { Router, type IRouter } from "express";

const router: IRouter = Router();

router.get("/privacy", (_req, res) => {
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Privacy Policy — RUZIVO</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      background: #0B3D2E;
      color: #FFFFFF;
      min-height: 100vh;
      padding: 40px 20px 80px;
    }
    .container { max-width: 680px; margin: 0 auto; }
    header { text-align: center; margin-bottom: 48px; }
    header h1 { font-size: 2rem; color: #C9A227; letter-spacing: 0.1em; }
    header p.tagline { color: #88A898; margin-top: 6px; font-size: 0.95rem; }
    header p.date { color: #88A89899; margin-top: 4px; font-size: 0.85rem; }
    .intro {
      font-size: 0.95rem;
      line-height: 1.7;
      color: #FFFFFF;
      margin-bottom: 40px;
      padding: 20px;
      background: rgba(255,255,255,0.05);
      border-radius: 12px;
      border-left: 3px solid #C9A227;
    }
    section { margin-bottom: 36px; }
    section h2 {
      font-size: 1rem;
      font-weight: 600;
      color: #C9A227;
      letter-spacing: 0.05em;
      margin-bottom: 14px;
      padding-bottom: 8px;
      border-bottom: 1px solid rgba(201,162,39,0.2);
    }
    section p { font-size: 0.9rem; line-height: 1.7; color: #FFFFFF; margin-bottom: 10px; }
    ul { list-style: none; padding: 0; }
    ul li {
      font-size: 0.9rem;
      line-height: 1.7;
      color: #FFFFFF;
      padding: 4px 0 4px 18px;
      position: relative;
    }
    ul li::before { content: "•"; color: #C9A227; position: absolute; left: 0; }
    ul li strong { color: #FFFFFF; font-weight: 600; }
    .contact-card {
      display: flex;
      align-items: center;
      gap: 14px;
      background: rgba(255,255,255,0.06);
      border: 1px solid rgba(201,162,39,0.25);
      border-radius: 12px;
      padding: 18px 20px;
      margin-top: 40px;
    }
    .contact-card .label { font-size: 0.8rem; color: #88A898; }
    .contact-card a { color: #C9A227; font-weight: 600; text-decoration: none; font-size: 0.95rem; }
    .contact-card a:hover { text-decoration: underline; }
    footer {
      text-align: center;
      margin-top: 48px;
      font-size: 0.8rem;
      color: #88A89888;
    }
    footer a { color: #C9A22788; text-decoration: none; }
  </style>
</head>
<body>
  <div class="container">
    <header>
      <h1>RUZIVO</h1>
      <p class="tagline">African Plant Knowledge App</p>
      <p class="date">Privacy Policy &mdash; Last updated: June 2026</p>
    </header>

    <div class="intro">
      RUZIVO is designed with your privacy as a priority. We collect only what is necessary
      to provide plant identification and health analysis, and we store everything locally
      on your device.
    </div>

    <section>
      <h2>What We Collect</h2>
      <ul>
        <li><strong>Plant photos</strong> — captured or chosen by you, sent to our AI service for identification or health analysis only. Photos are not stored on our servers.</li>
        <li><strong>Scan history</strong> — your past plant scans and health checks are stored locally on your device only. We have no access to this data.</li>
      </ul>
    </section>

    <section>
      <h2>What We Don't Collect</h2>
      <ul>
        <li>No personal information of any kind</li>
        <li>No name, email address or password</li>
        <li>No location or GPS data</li>
        <li>No user accounts or profiles</li>
        <li>No tracking, analytics or advertising identifiers</li>
      </ul>
    </section>

    <section>
      <h2>Third-Party Services</h2>
      <p>
        RUZIVO uses the following AI services to process plant images. When you submit a photo
        for analysis, it is sent to these services and subject to their respective privacy policies:
      </p>
      <ul>
        <li><strong>OpenAI GPT-4o</strong> — used for plant identification and health diagnosis. Images are processed transiently and are not retained by OpenAI for training.</li>
        <li><strong>Google Gemini</strong> — used to generate contextual plant knowledge and traditional African plant information.</li>
      </ul>
    </section>

    <section>
      <h2>Your Rights</h2>
      <ul>
        <li>Delete your scan history at any time from within the app</li>
        <li>All locally stored data is removed when you uninstall the app</li>
        <li>We cannot access, view or recover data stored on your device</li>
        <li>You may stop using the app at any time &mdash; no account deletion is needed</li>
      </ul>
    </section>

    <section>
      <h2>Data Security</h2>
      <p>
        All communication between the app and our services uses encrypted HTTPS connections.
        Plant photos are transmitted securely and are not cached or stored by RUZIVO's servers
        after processing is complete.
      </p>
    </section>

    <section>
      <h2>Children's Privacy</h2>
      <p>
        RUZIVO does not knowingly collect any information from children under the age of 13.
        The app does not require account creation or personal information from any user.
      </p>
    </section>

    <section>
      <h2>Changes to This Policy</h2>
      <p>
        If we update this privacy policy, the new version will be published in the app and
        at this URL. Continued use of the app after changes constitutes acceptance of the
        updated policy.
      </p>
    </section>

    <div class="contact-card">
      <div>
        <div class="label">Privacy Contact</div>
        <a href="mailto:privacy@ruzivo.app">privacy@ruzivo.app</a>
      </div>
    </div>

    <footer>
      <p>&copy; 2026 RUZIVO &mdash; African Plant Knowledge</p>
    </footer>
  </div>
</body>
</html>`);
});

export default router;
