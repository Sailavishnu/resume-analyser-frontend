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
  const inputBaseClass = `
    w-full px-3 py-2 text-sm rounded-xl
    focus:outline-none transition-all duration-150 input-glass
    ${error ? 'border-brand-rose!' : ''}
  `;

  return (
    <div className={`flex flex-col gap-1.5 w-full ${className}`}>
      {label && (
        <label htmlFor={id} className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>
          {label}
        </label>
      )}
      
      {type === 'select' ? (
        <select
          id={id}
          className={`${inputBaseClass} cursor-pointer`}
          style={{ background: 'var(--bg-input)', color: 'var(--text-primary)' }}
          {...register}
          {...props}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      ) : type === 'textarea' ? (
        <textarea
          id={id}
          placeholder={placeholder}
          className={`${inputBaseClass} min-h-[100px] resize-y`}
          style={{ color: 'var(--text-primary)' }}
          {...register}
          {...props}
        />
      ) : (
        <input
          id={id}
          type={type}
          placeholder={placeholder}
          className={inputBaseClass}
          style={{ color: 'var(--text-primary)' }}
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

