'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import EmbedWidget from './EmbedWidget';

type Product = {
  id: string;
  name: string;
  type: string;
  image_url: string;
  metadata: Record<string, number>;
};

type ProductShowcaseProps = {
  products: {
    watches: Product[];
    bracelets: Product[];
    rings: Product[];
  };
};

export default function ProductShowcase({ products }: ProductShowcaseProps) {
  const [activeCategory, setActiveCategory] = useState<'watches' | 'bracelets' | 'rings'>('watches');

  const hasProducts = products.watches.length > 0 || products.bracelets.length > 0 || products.rings.length > 0;

  if (!hasProducts) {
    return (
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center">
            <h2 className="text-4xl font-serif text-[#1F2937] mb-4">Try On Our Collection</h2>
            <p className="text-gray-600 mb-8">
              No products available yet. Check back soon!
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl font-serif text-[#1F2937] mb-4"
          >
            Try On Our Collection
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            viewport={{ once: true }}
            className="text-gray-600"
          >
            Experience luxury jewelry with our virtual try-on technology
          </motion.p>
        </div>

        {/* Category Tabs */}
        <div className="flex justify-center gap-4 mb-12 flex-wrap">
          {products.watches.length > 0 && (
            <button
              onClick={() => setActiveCategory('watches')}
              className={`px-6 py-3 rounded-full font-medium capitalize transition-all duration-200 ${
                activeCategory === 'watches'
                  ? 'bg-[#2D8C88] text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Watches ({products.watches.length})
            </button>
          )}
          {products.bracelets.length > 0 && (
            <button
              onClick={() => setActiveCategory('bracelets')}
              className={`px-6 py-3 rounded-full font-medium capitalize transition-all duration-200 ${
                activeCategory === 'bracelets'
                  ? 'bg-[#2D8C88] text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Bracelets ({products.bracelets.length})
            </button>
          )}
          {products.rings.length > 0 && (
            <button
              onClick={() => setActiveCategory('rings')}
              className={`px-6 py-3 rounded-full font-medium capitalize transition-all duration-200 ${
                activeCategory === 'rings'
                  ? 'bg-[#2D8C88] text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Rings ({products.rings.length})
            </button>
          )}
        </div>

        {/* Product Grid */}
        <motion.div
          key={activeCategory}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto"
        >
          {products[activeCategory].map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="flex justify-center"
            >
              <EmbedWidget product={product} />
            </motion.div>
          ))}
        </motion.div>

        {products[activeCategory].length === 0 && (
          <div className="text-center text-gray-500 py-12">
            No {activeCategory} available yet
          </div>
        )}
      </div>
    </section>
  );
}
