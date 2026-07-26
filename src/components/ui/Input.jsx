import React from 'react';

export default function Input({
  label,
  id,
  type = 'text',
  error,
  options = [], // Used only when type="select"
  className = '',
  placeholder = '',
  register = {}, // For react-hook-form registration
  ...props
}) {
  const inputBaseStyles = `
    w-full px-3 py-2 text-sm bg-obsidian-900 border text-gray-200 placeholder-gray-500 rounded-lg
    focus:outline-none focus:ring-1 focus:ring-brand-blue focus:border-brand-blue
    transition-all duration-150
    ${error ? 'border-brand-rose' : 'border-white/[0.08] hover:border-white/[0.15]'}
  `;

  return (
    <div className={`flex flex-col gap-1.5 w-full ${className}`}>
      {label && (
        <label htmlFor={id} className="text-xs font-medium text-gray-400">
          {label}
        </label>
      )}
      
      {type === 'select' ? (
        <select
          id={id}
          className={`${inputBaseStyles} cursor-pointer`}
          {...register}
          {...props}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-obsidian-900 text-gray-200">
              {opt.label}
            </option>
          ))}
        </select>
      ) : type === 'textarea' ? (
        <textarea
          id={id}
          placeholder={placeholder}
          className={`${inputBaseStyles} min-h-[100px] resize-y`}
          {...register}
          {...props}
        />
      ) : (
        <input
          id={id}
          type={type}
          placeholder={placeholder}
          className={inputBaseStyles}
          {...register}
          {...props}
        />
      )}

      {error && (
        <span className="text-xs font-normal text-brand-rose mt-0.5">
          {error}
        </span>
      )}
    </div>
  );
}
