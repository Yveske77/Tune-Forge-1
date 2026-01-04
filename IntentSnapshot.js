
import { uid } from './id'

const SNAPSHOT_VERSION = "1.0";

export function createSnapshot(doc) {
    if (!doc) return null;

    return {
        _version: SNAPSHOT_VERSION,
        _timestamp: Date.now(),
        meta: { ...doc.meta },
        architecture: { ...doc.architecture },
        nuance: { ...doc.nuance },
        lanes: { ...doc.lanes },
        activeVariant: doc.activeVariant,
        arrangementVariants: { ...doc.arrangementVariants },
        arrangementTracks: { ...doc.arrangementTracks },
        // Legacy fallback
        arrangement: doc.arrangement || [],
        layers: { ...doc.layers },
        sectionLayerAutomation: { ...doc.sectionLayerAutomation }
    };
}

export function validateSnapshot(json) {
    if (!json || typeof json !== 'object') return false;
    // Basic structural check
    if (!json._version) return false;
    if (!json.arrangementTracks && !json.arrangement) return false;
    return true;
}

export function restoreSnapshot(json) {
    if (!validateSnapshot(json)) {
        throw new Error("Invalid DAiW Snapshot format");
    }

    // Normalize or migrate if needed based on json._version
    // For now, return as is, merging with default doc structure if needed logic existed
    return json;
}
