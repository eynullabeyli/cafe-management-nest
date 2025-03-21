import React from 'react';
import { FiAlertCircle, FiCheckCircle, FiInfo, FiX } from 'react-icons/fi';

const Alert = ({ type = 'info', message, onClose, className = '' }) => {
  const alertTypes = {
    info: {
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700',
      borderColor: 'border-blue-300',
      icon: <FiInfo className="h-5 w-5 text-blue-400" />
    },
    success: {
      bgColor: 'bg-green-50',
      textColor: 'text-green-700',
      borderColor: 'border-green-300',
      icon: <FiCheckCircle className="h-5 w-5 text-green-400" />
    },
    warning: {
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-700',
      borderColor: 'border-yellow-300',
      icon: <FiAlertCircle className="h-5 w-5 text-yellow-400" />
    },
    error: {
      bgColor: 'bg-red-50',
      textColor: 'text-red-700',
      borderColor: 'border-red-300',
      icon: <FiAlertCircle className="h-5 w-5 text-red-400" />
    }
  };

  const { bgColor, textColor, borderColor, icon } = alertTypes[type] || alertTypes.info;

  return (
    <div className={`rounded-md border p-4 ${bgColor} ${borderColor} ${className}`}>
      <div className="flex">
        <div className="flex-shrink-0">{icon}</div>
        <div className="ml-3 flex-1">
          <p className={`text-sm font-medium ${textColor}`}>{message}</p>
        </div>
        {onClose && (
          <div className="ml-auto pl-3">
            <div className="-mx-1.5 -my-1.5">
              <button
                type="button"
                onClick={onClose}
                className={`inline-flex rounded-md p-1.5 ${bgColor} ${textColor} hover:bg-opacity-80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-blue-50`}
              >
                <span className="sr-only">Dismiss</span>
                <FiX className="h-5 w-5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Alert;