import React from 'react';
import { BarChart3, Users, Package, FileText, TrendingUp, Award, Shield, Briefcase } from 'lucide-react';
import { useTabs } from '@context/TabContext.jsx';
import { useUserContext } from '@context/userContext.jsx';
import { useTranslation } from 'react-i18next';

/**
 * Dashboard Module
 * Business overview and KPIs
 */
export default function Dashboard() {
  const { openTab } = useTabs();
  const { state: userState } = useUserContext();
  const { t } = useTranslation();

  // Get user role for statistics display
  const userRole = userState?.user?.profile?.role || 1;
  const userName = userState?.user?.profile?.nickname || userState?.user?.name || 'User';

  // Define role-specific statistics
  const getRoleStats = () => {
    switch(userRole) {
      case 3: // Admin
        return [
          { label: 'Total Users', value: '12', icon: Users, color: '#3b82f6' },
          { label: 'Active Sales', value: '48', icon: TrendingUp, color: '#10b981' },
          { label: 'Pending Orders', value: '5', icon: Briefcase, color: '#f59e0b' },
          { label: 'System Health', value: '98%', icon: Shield, color: '#06b6d4' },
        ];
      case 2: // Manager
        return [
          { label: 'Team Members', value: '8', icon: Users, color: '#3b82f6' },
          { label: 'Sales Today', value: 'SAR 5,240', icon: TrendingUp, color: '#10b981' },
          { label: 'Pending Tasks', value: '3', icon: Briefcase, color: '#f59e0b' },
          { label: 'Performance', value: '95%', icon: Award, color: '#06b6d4' },
        ];
      default: // Seller
        return [
          { label: 'Today Sales', value: 'SAR 1,240', icon: TrendingUp, color: '#10b981' },
          { label: 'Transactions', value: '24', icon: FileText, color: '#3b82f6' },
          { label: 'Customers', value: '18', icon: Users, color: '#f59e0b' },
          { label: 'Commission', value: 'SAR 186', icon: Award, color: '#06b6d4' },
        ];
    }
  };

  const roleStats = getRoleStats();

  const quickActions = [
    { label: t('menuItems.newInvoice'), icon: FileText, action: () => openTab('SalesScreen', t('menuItems.newInvoice'), {}, false), color: '#3b82f6' },
    { label: t('menuItems.products'), icon: Package, action: () => openTab('Products', t('menuItems.products'), {}, true), color: '#8b5cf6' },
    { label: t('menuItems.customers'), icon: Users, action: () => openTab('Customers', t('menuItems.customers'), {}, true), color: '#ec4899' },
    { label: t('menuItems.salesReports'), icon: BarChart3, action: () => openTab('SalesReport', t('menuItems.salesReports'), {}, true), color: '#f59e0b' },
  ];

  return (
    <div style={{ padding: '32px', height: '100%', overflow: 'auto' , width  : "50%" }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
        {/* App Header with Centered Logo */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '12px',
          textAlign: 'center',
        }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '8px',
            background: 'linear-gradient(135deg, var(--color-primary), #f59e0b)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 'bold',
            fontSize: '20px',
            color: '#fff',
            boxShadow: '0 4px 12px rgba(250, 204, 21, 0.2)',
          }}>
            Ω
          </div>
          <div>
            <h1 style={{
              fontSize: '28px',
              fontWeight: 'bold',
              margin: 0,
              color: 'var(--color-text)',
            }}>{t('dashboard.title')}</h1>
            <p style={{
              fontSize: '12px',
              color: 'var(--color-muted)',
              margin: 0,
              marginTop: '4px',
            }}>{t('dashboard.subtitle')}</p>
          </div>
        </div>

        {/* User Role Statistics */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
          gap: '12px',
        }}>
          {roleStats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div
                key={idx}
                style={{
                  padding: '16px',
                  backgroundColor: 'var(--bg-secondary)',
                  border: '1px solid var(--color-border-muted)',
                  borderRadius: '8px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                  transition: 'all var(--transition-normal)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = stat.color;
                  e.currentTarget.style.boxShadow = `0 4px 12px ${stat.color}20`;
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--color-border-muted)';
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Icon size={16} style={{ color: stat.color }} />
                  <span style={{ fontSize: '12px', color: 'var(--color-muted)' }}>{stat.label}</span>
                </div>
                <div style={{ fontSize: '20px', fontWeight: 'bold', color: stat.color }}>
                  {stat.value}
                </div>
              </div>
            );
          })}
        </div>

        {/* Welcome Message */}
        <div style={{
          padding: '20px 24px',
          backgroundColor: 'var(--bg-secondary)',
          borderRadius: '8px',
          border: '1px solid var(--color-border-muted)',
          borderLeft: '4px solid var(--color-primary)',
        }}>
          <p style={{
            fontSize: '16px',
            fontWeight: '500',
            margin: 0,
            color: 'var(--color-text)',
          }}>
            {t('dashboard.welcome')}, <span style={{ color: 'var(--color-primary)' }}>{userState?.user?.name || 'User'}</span>! 👋
          </p>
          <p style={{
            fontSize: '13px',
            color: 'var(--color-muted)',
            margin: '8px 0 0 0',
          }}>
            {t('dashboard.readyToManage')}
          </p>
        </div>

        {/* Quick Access Actions */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
          gap: '16px',
        }}>
          {quickActions.map((action, idx) => {
            const Icon = action.icon;
            return (
              <div
                key={idx}
                onClick={action.action}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  padding: '20px',
                  backgroundColor: 'var(--bg-secondary)',
                  border: '2px solid var(--color-border-muted)',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  transition: 'all var(--transition-normal)',
                  textAlign: 'center',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = action.color;
                  e.currentTarget.style.backgroundColor = `${action.color}10`;
                  e.currentTarget.style.transform = 'translateY(-4px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--color-border-muted)';
                  e.currentTarget.style.backgroundColor = 'var(--bg-secondary)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <Icon size={32} style={{ color: action.color }} />
                <span style={{
                  fontSize: '13px',
                  fontWeight: '500',
                  color: 'var(--color-text)',
                }}>{action.label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
