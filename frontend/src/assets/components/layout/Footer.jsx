import React, { useState, useEffect } from 'react';
import { Clock, Package, TrendingUp, Users, AlertTriangle, LogOut } from 'lucide-react';
import { useUiContext } from '@context/uiContext.jsx';
import { useUserContext } from '@context/userContext.jsx';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

/**
 * Footer Component - Displays system time and app statistics
 * Positioned at the bottom of the app for status information
 */

function Footer() {
  const { state: uiState, dispatch: uiDispatch } = useUiContext();
  const { dispatch: userDispatch } = useUserContext();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [currentTime, setCurrentTime] = useState(new Date());
  const isRTL = i18n.language === 'ar';

  // Logout handler
  const handleLogout = () => {
    uiDispatch({
      type: 'confirm',
      payload: {
        title: t('confirm.logout.title'),
        message: t('confirm.logout.message'),
        onConfirm: () => {
          // Clear localStorage
          localStorage.clear();
          // Clear user context
          userDispatch({ type: 'user.logout' });
          // Redirect to login
          navigate('/login');
        }
      }
    });
  };

  // Update clock every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Format time
  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
  };

  // Format date
  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div
      style={{
        height: '28px',
        display: 'flex',
        alignItems: 'center',
        paddingLeft: '12px',
        paddingRight: '12px',
        backgroundColor: 'var(--bg-secondary)',
        borderTop: '1px solid var(--color-border-muted)',
        gap: '16px',
        fontSize: '11px',
        color: 'var(--color-muted)',
        userSelect: 'none',
        transition: 'background-color var(--transition-normal), border-color var(--transition-normal)',
      }}
    >
      {/* Time Display */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          whiteSpace: 'nowrap',
          [isRTL ? 'marginLeft' : 'marginRight']: 'auto',
          paddingRight: isRTL ? 0 : '16px',
          paddingLeft: isRTL ? '16px' : 0,
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          <Clock size={12} />
          <span style={{ fontWeight: '500' }}>{formatTime(currentTime)}</span>
          <span style={{ opacity: 0.6 }}>|</span>
          <span style={{ opacity: 0.7 }}>{formatDate(currentTime)}</span>
        </div>

        {/* Separator */}
        <div
          style={{
            width: '1px',
            height: '16px',
            backgroundColor: 'var(--color-border-muted)',
            opacity: 0.5,
          }}
        />

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          title={t('footer.logout')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            padding: '4px 8px',
            backgroundColor: 'transparent',
            border: 'none',
            color: 'var(--color-muted)',
            cursor: 'pointer',
            borderRadius: '3px',
            transition: 'all var(--transition-fast)',
            fontSize: '11px',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--color-warning)';
            e.currentTarget.style.color = '#fff';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.color = 'var(--color-muted)';
          }}
        >
          <LogOut size={11} />
          <span>{t('footer.logout')}</span>
        </button>
      </div>

      {/* Status Indicators */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
        }}
      >
        {/* Online Status */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          <div
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: '#10b981',
            }}
          />
          <span>{t('footer.online')}</span>
        </div>

        {/* Separator */}
        <div
          style={{
            width: '1px',
            height: '16px',
            backgroundColor: 'var(--color-border-muted)',
            opacity: 0.5,
          }}
        />

        {/* Quick Stats */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              opacity: 0.8,
            }}
          >
            <Package size={11} />
            <span>0 {t('footer.items')}</span>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              opacity: 0.8,
            }}
          >
            <TrendingUp size={11} />
            <span>0 {t('footer.sales')}</span>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              opacity: 0.8,
            }}
          >
            <AlertTriangle size={11} style={{ color: 'var(--color-warning)' }} />
            <span>0 {t('footer.alerts')}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Footer;
