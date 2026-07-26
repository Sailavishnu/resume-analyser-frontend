import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, CheckCircle, AlertTriangle, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function FileUpload({
  onFileSelect,
  isAnalyzing = false,
  className = '',
}) {
  const [file, setFile] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    setErrorMsg('');
    setFile(null);

    if (rejectedFiles.length > 0) {
      const error = rejectedFiles[0].errors[0];
      if (error.code === 'file-invalid-type') {
        setErrorMsg('Invalid file format. Only PDF and DOCX are supported.');
      } else if (error.code === 'file-too-large') {
        setErrorMsg('File is too large. Maximum size is 5MB.');
      } else {
        setErrorMsg(error.message);
      }
      return;
    }

    if (acceptedFiles.length > 0) {
      const selectedFile = acceptedFiles[0];
      setFile(selectedFile);
      if (onFileSelect) {
        onFileSelect(selectedFile);
      }
    }
  }, [onFileSelect]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    },
    maxSize: 5 * 1024 * 1024, // 5MB
    multiple: false,
  });

  return (
    <div className={`w-full ${className}`}>
      <div
        {...getRootProps()}
        className={`
          flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-8 cursor-pointer
          transition-all duration-300 relative overflow-hidden bg-obsidian-900/40
          ${isDragActive 
            ? 'border-brand-blue bg-brand-blue/5 shadow-[0_0_20px_rgba(59,130,246,0.15)]' 
            : 'border-white/[0.08] hover:border-white/[0.15] hover:bg-obsidian-900/60'
          }
        `}
      >
        <input {...getInputProps()} />

        {isAnalyzing ? (
          <div className="flex flex-col items-center py-4">
            <Loader2 className="h-10 w-10 text-brand-blue animate-spin mb-4" />
            <motion.p
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="text-sm font-semibold text-white font-heading"
            >
              AI Extracting & Analyzing Resume Content...
            </motion.p>
            <p className="text-xs text-gray-500 mt-1">This takes about 2-3 seconds</p>
          </div>
        ) : file ? (
          <div className="flex flex-col items-center py-4">
            <div className="p-3 bg-brand-blue/10 rounded-xl text-brand-blue mb-4 border border-brand-blue/25">
              <FileText className="h-8 w-8" />
            </div>
            <p className="text-sm font-semibold text-white font-heading truncate max-w-xs">{file.name}</p>
            <p className="text-xs text-gray-400 mt-1">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
            <div className="flex items-center gap-1.5 mt-3 text-xs text-brand-emerald bg-brand-emerald/10 border border-brand-emerald/20 px-2 py-0.5 rounded-full font-medium">
              <CheckCircle className="h-3.5 w-3.5" /> Ready for analysis
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center text-center">
            <div className={`p-4 bg-obsidian-800 rounded-full text-gray-400 mb-4 border border-white/[0.04] transition-colors ${isDragActive ? 'text-brand-blue border-brand-blue/30' : ''}`}>
              <Upload className="h-6 w-6" />
            </div>
            <p className="text-sm font-semibold text-white font-heading mb-1.5">
              {isDragActive ? 'Drop your resume here' : 'Upload your resume'}
            </p>
            <p className="text-xs text-gray-400 max-w-xs mb-3 leading-relaxed">
              Drag & drop your file or <span className="text-brand-blue font-medium hover:underline">browse</span> to select.
            </p>
            <p className="text-[10px] text-gray-500">Supports PDF & DOCX (Max 5MB)</p>
          </div>
        )}
      </div>

      {errorMsg && (
        <div className="flex items-center gap-2 mt-3 p-3 bg-brand-rose/10 border border-brand-rose/25 rounded-lg text-brand-rose text-xs">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}
    </div>
  );
}
