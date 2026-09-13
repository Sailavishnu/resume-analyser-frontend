/**
 * Mock ATS Service
 * Simulates enterprise parser behavior (Workday, Taleo, Greenhouse).
 */

export const atsService = {
  async getAtsScan(resumeId, targetJobId = null) {
    await new Promise(r => setTimeout(r, 450));
    return {
      atsScore: targetJobId ? 92 : 88,
      parserReadability: 'High (100%)',
      checks: [
        { label: 'Contact Header Extraction', passed: true, detail: 'Phone, Email, LinkedIn, GitHub cleanly detected.' },
        { label: 'Standard Section Headings', passed: true, detail: 'Experience, Education, Skills, Projects matched canonical schema.' },
        { label: 'Font & Layout Compatibility', passed: true, detail: 'Single column, standard font sizing, no embedded shapes.' },
        { label: 'Keyword Density & Stemming', passed: true, detail: 'Healthy 3.8% keyword frequency without keyword stuffing.' },
        { label: 'Target Job Keyword Alignment', passed: !targetJobId || targetJobId === 'job-1', detail: 'Matches 9 of 10 primary job description skills.' },
        { label: 'Chronological Work History', passed: true, detail: 'Dates formatted consistently in MM/YYYY format.' }
      ],
      warnings: [
        { id: 'w1', text: 'Avoid nested bullet indentations; some legacy parsers flatten them incorrectly.' }
      ],
      recommendedFix: 'Keep single-column typography and add explicit skill tags matching the target JD.'
    };
  }
};
