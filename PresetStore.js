import proBlocks from '../../proBlocks.json';
import adaptiveBlocks from '../../adaptiveBlocks.json';

// SKU Definitions
export const SKUS = {
    STARTER: {
        id: 'sku_starter',
        name: 'DAiW Starter Blocks',
        price: 0,
        description: 'Essential blocks for onboarding and habit formation.',
        blocks: [
            // Subset of proBlocks
            'build_classic_lift',
            'drop_wide_anthem',
            'break_emotional_strip',
            'var_second_chorus_upgrade',
            'outro_fade_classic'
        ]
    },
    FLAGSHIP: {
        id: 'sku_flagship',
        name: 'DAiW Pro Blocks Vol. 1',
        price: 29,
        description: '25 Professional Arrangement Blocks (Builds, Drops, Breaks, Variations, Outros).',
        blocks: 'ALL_PRO' // Special flag or list all IDs
    },
    ADAPTIVE: {
        id: 'sku_adaptive',
        name: 'DAiW Adaptive Blocks Pack',
        price: 49,
        description: 'Blocks that scale behavior based on neighbors and context.',
        blocks: 'ALL_ADAPTIVE'
    }
};

class PresetStore {
    constructor() {
        this.skus = SKUS;
        this.proBlocks = proBlocks;
        this.adaptiveBlocks = adaptiveBlocks;
    }

    getPack(skuId) {
        return Object.values(this.skus).find(s => s.id === skuId);
    }

    getAllBlocks() {
        return [...this.proBlocks, ...this.adaptiveBlocks];
    }

    getBlocksForSKU(skuId) {
        const sku = this.getPack(skuId);
        if (!sku) return [];

        if (sku.blocks === 'ALL_PRO') return this.proBlocks;
        if (sku.blocks === 'ALL_ADAPTIVE') return this.adaptiveBlocks;

        if (Array.isArray(sku.blocks)) {
            // Filter from all blocks
            const all = this.getAllBlocks();
            return all.filter(b => sku.blocks.includes(b.id));
        }
        return [];
    }
}

export const presetStore = new PresetStore();
