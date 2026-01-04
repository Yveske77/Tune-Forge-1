
export function analyzeArrangement(sections) {
    if (!sections || sections.length === 0) {
        return { score: 0, indicators: [], descriptors: [] };
    }

    const energies = sections.map(s => s.lanes?.energy ?? s.tension ?? 50);
    const len = energies.length;

    const indicators = [];
    const descriptors = [];
    let score = 50;

    // 1. Arc Strength (Start Low -> Peak -> End Low/Mid)
    const start = energies[0];
    const peak = Math.max(...energies);
    const end = energies[len - 1];

    if (len >= 3) {
        if (start < 40 && peak > 80 && end < 50) {
            indicators.push({ label: "Strong Arc", type: "good" });
            score += 20;
        } else if (peak - start < 20) {
            indicators.push({ label: "Weak Progression", type: "warn" });
            score -= 10;
        }
    }

    // 2. Flat Midsection
    if (len >= 5) {
        const midStart = Math.floor(len * 0.3);
        const midEnd = Math.floor(len * 0.7);
        const mid = energies.slice(midStart, midEnd);
        const minMid = Math.min(...mid);
        const maxMid = Math.max(...mid);

        if (maxMid - minMid < 15) {
            indicators.push({ label: "Flat Midsection", type: "info" });
        }
    }

    // 3. Dynamic Range
    const dynamicRange = peak - Math.min(...energies);
    if (dynamicRange > 50) {
        descriptors.push("High Contrast");
    } else if (dynamicRange < 20) {
        descriptors.push("Consistent Energy");
    }

    // 4. Climax Position
    const peakIndex = energies.indexOf(peak);
    if (peakIndex > len * 0.6 && peakIndex < len - 1) {
        descriptors.push("Late Peak");
    } else if (peakIndex < len * 0.4) {
        descriptors.push("Early Peak");
    }

    return {
        score: Math.min(100, Math.max(0, score)),
        indicators,
        descriptors
    };
}
