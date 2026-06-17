import React from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';

const ProductCard = ({ product }) => {
  const { _id, name, category, image, monthlyRent, securityDeposit, availability } = product;

  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl border border-dark-800 bg-dark-900 shadow-glass transition-all hover:-translate-y-1 hover:border-brand-500 hover:shadow-glass-hover">
      {/* Product Image */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-dark-800">
        <img
          src={image}
          alt={name}
          className="h-full w-full object-cover object-center transition-all duration-300 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute top-3 left-3 rounded-full bg-dark-950/80 px-3 py-1 text-[10px] font-semibold tracking-wide text-brand-400 backdrop-blur-xs">
          {category}
        </div>
        {!availability && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-xs">
            <span className="rounded-full bg-rose-600 px-4 py-1 text-xs font-semibold uppercase text-white tracking-wider">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* Product Content */}
      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-base font-bold text-white line-clamp-1 group-hover:text-brand-400 transition-colors">
          {name}
        </h3>

        {/* Pricing Summary */}
        <div className="mt-4 grid grid-cols-2 gap-4 border-t border-dark-800 pt-4 text-xs">
          <div>
            <p className="text-dark-500 font-medium uppercase tracking-wider text-[10px]">Monthly Rent</p>
            <p className="mt-1 text-lg font-extrabold text-white">
              ${monthlyRent}
              <span className="text-xs font-normal text-dark-400">/mo</span>
            </p>
          </div>
          <div>
            <p className="text-dark-500 font-medium uppercase tracking-wider text-[10px]">Deposit</p>
            <p className="mt-1 text-lg font-extrabold text-dark-200">
              ${securityDeposit}
            </p>
          </div>
        </div>

        {/* Action Link */}
        <div className="mt-5">
          <Link
            to={`/products/${_id}`}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-dark-700 bg-dark-800/50 py-2.5 text-xs font-semibold text-white transition-all hover:bg-brand-600 hover:border-brand-500 hover:text-white"
          >
            <span>View Details</span>
            <FiArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
