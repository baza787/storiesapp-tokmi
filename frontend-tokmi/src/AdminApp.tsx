import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Cloud, LogOut, RefreshCw, Plus, Trash2, Edit3, Power,
  ChevronRight, AlertTriangle, CheckCircle, BarChart2,
  Users, Image, HardDrive, X, Eye, EyeOff, Shield, ArrowLeft
} from 'lucide-react';
import {
  adminAPI, CloudAccount, AdminStats, AdminUser,
  formatBytes, Admin
} from './adminTypes';

// ─────────────────────────────────────────────────────────────────────────────
// ADMIN LOGIN
// ─────────────────────────────────────────────────────────────────────────────
function AdminLogin({ onLogin }: { onLogin: (token: string, admin: Admin) => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [setupMode, setSetupMode] = useState(false);
  const [username, setUsername] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const res = setupMode
        ? await adminAPI.setup(username, email, password)
        : await adminAPI.login(email, password);
      localStorage.setItem('adminToken', res.token);
      onLogin(res.token, res.admin);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: '#0e0e13', padding: 24,
      backgroundImage: 'radial-gradient(ellipse at 30% 20%, rgba(200,153,255,0.08) 0%, transparent 50%), radial-gradient(ellipse at 70% 80%, rgba(149,146,255,0.06) 0%, transparent 50%)'
    }}>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          width: '100%', maxWidth: 400,
          background: 'rgba(21,21,29,0.9)',
          border: '1px solid rgba(200,153,255,0.15)',
          borderRadius: 24, padding: 40,
          backdropFilter: 'blur(20px)',
          boxShadow: '0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(200,153,255,0.05)'
        }}
      >
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{
            width: 60, height: 60, borderRadius: 18, margin: '0 auto 16px',
            background: 'linear-gradient(135deg, #c899ff, #9592ff)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 8px 32px rgba(200,153,255,0.3)'
          }}>
            <Shield size={28} color="#fff" />
          </div>
          <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-0.5px', color: '#fff', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
            TOKMI <span style={{ background: 'linear-gradient(135deg,#c899ff,#9592ff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Admin</span>
          </div>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginTop: 6, fontFamily: 'Manrope, sans-serif' }}>
            {setupMode ? 'Создание первого администратора' : 'Панель управления'}
          </div>
        </div>

        <form onSubmit={handleLogin}>
          {setupMode && (
            <Field label="Имя пользователя" value={username} onChange={setUsername} placeholder="admin" />
          )}
          <Field label="Email" value={email} onChange={setEmail} type="email" placeholder="admin@tokmi.app" />
          <div style={{ marginBottom: 20, position: 'relative' }}>
            <label style={labelStyle}>Пароль</label>
            <input
              type={showPwd ? 'text' : 'password'}
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder={setupMode ? 'Минимум 8 символов' : '••••••••'}
              style={{ ...inputStyle, paddingRight: 44 }}
              required
            />
            <button type="button" onClick={() => setShowPwd(!showPwd)}
              style={{ position: 'absolute', right: 14, top: 38, background: 'none', border: 'none', color: 'rgba(255,255,255,0.3)', cursor: 'pointer' }}>
              {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          {error && (
            <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 10, padding: '10px 14px', marginBottom: 16, fontSize: 13, color: '#fca5a5', display: 'flex', gap: 8, alignItems: 'center' }}>
              <AlertTriangle size={14} /> {error}
            </div>
          )}

          <motion.button
            whileTap={{ scale: 0.97 }}
            type="submit"
            disabled={loading}
            style={{
              width: '100%', padding: '14px', border: 'none', borderRadius: 12, cursor: 'pointer',
              background: 'linear-gradient(135deg, #c899ff, #9592ff)',
              color: '#fff', fontWeight: 700, fontSize: 14, fontFamily: 'Plus Jakarta Sans, sans-serif',
              opacity: loading ? 0.7 : 1, boxShadow: '0 4px 20px rgba(200,153,255,0.3)'
            }}
          >
            {loading ? 'Подождите...' : setupMode ? 'Создать администратора' : 'Войти'}
          </motion.button>
        </form>

        <button
          onClick={() => { setSetupMode(!setupMode); setError(''); }}
          style={{ width: '100%', marginTop: 16, background: 'none', border: 'none', color: 'rgba(200,153,255,0.6)', fontSize: 12, cursor: 'pointer', fontFamily: 'Manrope, sans-serif' }}
        >
          {setupMode ? '← Вернуться ко входу' : 'Первый запуск? Создать аккаунт'}
        </button>
      </motion.div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN ADMIN PANEL
// ─────────────────────────────────────────────────────────────────────────────
function AdminPanel({ admin, onLogout }: { admin: Admin; onLogout: () => void }) {
  const [tab, setTab] = useState<'dashboard' | 'cloud' | 'users'>('dashboard');
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [cloudAccounts, setCloudAccounts] = useState<CloudAccount[]>([]);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [statsRes, cloudRes] = await Promise.all([adminAPI.stats(), adminAPI.getCloudAccounts()]);
      setStats(statsRes);
      setCloudAccounts(cloudRes.accounts);
    } catch (e: any) { showToast(e.message, 'error'); }
    setLoading(false);
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  useEffect(() => {
    if (tab === 'users') {
      adminAPI.getUsers().then(r => setUsers(r.users)).catch(e => showToast(e.message, 'error'));
    }
  }, [tab]);

  return (
    <div style={{ minHeight: '100vh', background: '#0e0e13', fontFamily: 'Manrope, sans-serif' }}>
      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            style={{
              position: 'fixed', top: 20, right: 20, zIndex: 9999, padding: '12px 20px',
              borderRadius: 12, fontSize: 14, fontWeight: 600, display: 'flex', gap: 8, alignItems: 'center',
              background: toast.type === 'success' ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)',
              border: `1px solid ${toast.type === 'success' ? 'rgba(34,197,94,0.4)' : 'rgba(239,68,68,0.4)'}`,
              color: toast.type === 'success' ? '#86efac' : '#fca5a5',
              backdropFilter: 'blur(20px)'
            }}
          >
            {toast.type === 'success' ? <CheckCircle size={16} /> : <AlertTriangle size={16} />}
            {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <div style={{
        position: 'fixed', left: 0, top: 0, bottom: 0, width: 220,
        background: 'rgba(15,15,21,0.95)', borderRight: '1px solid rgba(200,153,255,0.1)',
        backdropFilter: 'blur(20px)', display: 'flex', flexDirection: 'column', padding: '24px 16px',
        zIndex: 100
      }}>
        {/* Logo */}
        <div style={{ marginBottom: 32, paddingLeft: 8 }}>
          <div style={{ fontSize: 18, fontWeight: 800, color: '#fff', fontFamily: 'Plus Jakarta Sans, sans-serif', letterSpacing: '-0.5px' }}>
            TOKMI <span style={{ background: 'linear-gradient(135deg,#c899ff,#9592ff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Admin</span>
          </div>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', marginTop: 3 }}>v1.0 · {admin.username}</div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
          {[
            { id: 'dashboard', icon: BarChart2, label: 'Дашборд' },
            { id: 'cloud', icon: Cloud, label: 'Облака' },
            { id: 'users', icon: Users, label: 'Пользователи' },
          ].map(({ id, icon: Icon, label }) => (
            <button
              key={id}
              onClick={() => setTab(id as any)}
              style={{
                display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px',
                borderRadius: 10, border: 'none', cursor: 'pointer', textAlign: 'left',
                background: tab === id ? 'rgba(200,153,255,0.12)' : 'transparent',
                color: tab === id ? '#c899ff' : 'rgba(255,255,255,0.45)',
                fontSize: 13, fontWeight: 600, fontFamily: 'Manrope, sans-serif',
                transition: 'all 0.15s'
              }}
            >
              <Icon size={16} />
              {label}
              {id === 'cloud' && stats?.cloudAccounts.overLimit ? (
                <span style={{ marginLeft: 'auto', width: 8, height: 8, background: '#f59e0b', borderRadius: '50%' }} />
              ) : null}
            </button>
          ))}
        </nav>

        {/* Logout */}
        <button
          onClick={onLogout}
          style={{
            display: 'flex', alignItems: 'center', gap: 8, padding: '10px 12px',
            borderRadius: 10, border: 'none', cursor: 'pointer', background: 'transparent',
            color: 'rgba(239,68,68,0.6)', fontSize: 13, fontWeight: 600, fontFamily: 'Manrope, sans-serif'
          }}
        >
          <LogOut size={16} /> Выйти
        </button>
      </div>

      {/* Main content */}
      <div style={{ marginLeft: 220, padding: '32px 40px', minHeight: '100vh' }}>
        <AnimatePresence mode="wait">
          {tab === 'dashboard' && <DashboardTab key="dash" stats={stats} loading={loading} onRefresh={loadData} />}
          {tab === 'cloud' && <CloudTab key="cloud" accounts={cloudAccounts} onRefresh={loadData} showToast={showToast} />}
          {tab === 'users' && <UsersTab key="users" users={users} showToast={showToast} onRefresh={() => adminAPI.getUsers().then(r => setUsers(r.users))} />}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// DASHBOARD TAB
// ─────────────────────────────────────────────────────────────────────────────
function DashboardTab({ stats, loading, onRefresh }: { stats: AdminStats | null; loading: boolean; onRefresh: () => void }) {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: '#fff', fontFamily: 'Plus Jakarta Sans, sans-serif', letterSpacing: '-0.5px' }}>Дашборд</h1>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginTop: 4 }}>Обзор состояния системы</p>
        </div>
        <motion.button whileTap={{ scale: 0.95 }} onClick={onRefresh}
          style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '10px 18px', background: 'rgba(200,153,255,0.1)', border: '1px solid rgba(200,153,255,0.2)', borderRadius: 10, color: '#c899ff', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
          <RefreshCw size={14} style={{ animation: loading ? 'spin 1s linear infinite' : 'none' }} /> Обновить
        </motion.button>
      </div>

      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 28 }}>
        {[
          { label: 'Пользователей', value: stats?.users ?? '—', icon: Users, color: '#c899ff', sub: 'всего' },
          { label: 'Активных сторис', value: stats?.stories.active ?? '—', icon: Image, color: '#9592ff', sub: `из ${stats?.stories.total ?? 0} всего` },
          { label: 'Облака', value: stats?.cloudAccounts.total ?? '—', icon: Cloud, color: '#ff92d0', sub: `${stats?.cloudAccounts.active ?? 0} активных` },
          { label: 'Хранилище', value: stats ? `${stats.storage.percent}%` : '—', icon: HardDrive, color: stats && stats.storage.percent > 80 ? '#f59e0b' : '#34d399', sub: stats ? `${formatBytes(stats.storage.used)} из ${formatBytes(stats.storage.limit)}` : '' }
        ].map(({ label, value, icon: Icon, color, sub }) => (
          <div key={label} style={{ background: 'rgba(21,21,29,0.8)', border: '1px solid rgba(200,153,255,0.08)', borderRadius: 16, padding: '20px 20px 16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', fontWeight: 600, letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: 8 }}>{label}</div>
                <div style={{ fontSize: 28, fontWeight: 800, color: '#fff', fontFamily: 'Plus Jakarta Sans, sans-serif', letterSpacing: '-1px' }}>{value}</div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', marginTop: 4 }}>{sub}</div>
              </div>
              <div style={{ width: 38, height: 38, background: `${color}15`, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon size={18} color={color} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Storage bar */}
      {stats && (
        <div style={{ background: 'rgba(21,21,29,0.8)', border: '1px solid rgba(200,153,255,0.08)', borderRadius: 16, padding: 24 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#fff', marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
            Использование хранилища
            <span style={{ fontSize: 12, color: stats.storage.percent > 80 ? '#f59e0b' : 'rgba(255,255,255,0.35)', fontWeight: 500 }}>
              {stats.storage.percent > 80 ? '⚠️ Близко к лимиту' : '✅ В норме'}
            </span>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: 8, height: 8, overflow: 'hidden' }}>
            <div style={{
              height: '100%', borderRadius: 8, transition: 'width 0.5s ease',
              width: `${Math.min(stats.storage.percent, 100)}%`,
              background: stats.storage.percent > 80
                ? 'linear-gradient(90deg, #f59e0b, #ef4444)'
                : 'linear-gradient(90deg, #c899ff, #9592ff)'
            }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, fontSize: 12, color: 'rgba(255,255,255,0.35)' }}>
            <span>{formatBytes(stats.storage.used)} использовано</span>
            <span>{formatBytes(stats.storage.limit)} лимит</span>
          </div>
        </div>
      )}
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CLOUD TAB
// ─────────────────────────────────────────────────────────────────────────────
function CloudTab({ accounts, onRefresh, showToast }: {
  accounts: CloudAccount[];
  onRefresh: () => void;
  showToast: (msg: string, type?: 'success' | 'error') => void;
}) {
  const [showAdd, setShowAdd] = useState(false);
  const [editAccount, setEditAccount] = useState<CloudAccount | null>(null);
  const [syncing, setSyncing] = useState<string | null>(null);
  const [toggling, setToggling] = useState<string | null>(null);

  const handleSync = async (id: string) => {
    setSyncing(id);
    try {
      await adminAPI.syncCloudUsage(id);
      showToast('Данные синхронизированы с Cloudinary');
      onRefresh();
    } catch (e: any) { showToast(e.message, 'error'); }
    setSyncing(null);
  };

  const handleToggle = async (id: string) => {
    setToggling(id);
    try {
      const res = await adminAPI.toggleCloudAccount(id);
      showToast(res.message);
      onRefresh();
    } catch (e: any) { showToast(e.message, 'error'); }
    setToggling(null);
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Удалить аккаунт "${name}"?`)) return;
    try {
      await adminAPI.deleteCloudAccount(id);
      showToast('Аккаунт удалён');
      onRefresh();
    } catch (e: any) { showToast(e.message, 'error'); }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: '#fff', fontFamily: 'Plus Jakarta Sans, sans-serif', letterSpacing: '-0.5px' }}>Облачные аккаунты</h1>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginTop: 4 }}>Управление Cloudinary аккаунтами и распределением нагрузки</p>
        </div>
        <motion.button whileTap={{ scale: 0.95 }} onClick={() => setShowAdd(true)}
          style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 18px', background: 'linear-gradient(135deg,#c899ff,#9592ff)', border: 'none', borderRadius: 10, color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 16px rgba(200,153,255,0.3)' }}>
          <Plus size={16} /> Добавить аккаунт
        </motion.button>
      </div>

      {/* Info box */}
      <div style={{ background: 'rgba(200,153,255,0.06)', border: '1px solid rgba(200,153,255,0.15)', borderRadius: 12, padding: '12px 16px', marginBottom: 20, fontSize: 12, color: 'rgba(200,153,255,0.7)', display: 'flex', gap: 10, alignItems: 'flex-start' }}>
        <Cloud size={14} style={{ marginTop: 1, flexShrink: 0 }} />
        <span>Аккаунты используются по очереди (round-robin). При заполнении одного — система автоматически переключается на следующий. Приоритет: чем меньше число, тем выше приоритет.</span>
      </div>

      {/* Accounts list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {accounts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: 'rgba(255,255,255,0.25)' }}>
            <Cloud size={48} style={{ marginBottom: 16, opacity: 0.3 }} />
            <p style={{ fontSize: 16, fontWeight: 600 }}>Нет облачных аккаунтов</p>
            <p style={{ fontSize: 13, marginTop: 8 }}>Добавьте Cloudinary аккаунт для хранения медиафайлов</p>
          </div>
        ) : accounts.map((acc, idx) => {
          const pct = Math.min(acc.usagePercent || 0, 100);
          const isWarning = pct >= 75;
          const isCritical = pct >= 90;

          return (
            <motion.div key={acc._id}
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}
              style={{
                background: 'rgba(21,21,29,0.8)',
                border: `1px solid ${isCritical ? 'rgba(239,68,68,0.3)' : isWarning ? 'rgba(245,158,11,0.25)' : 'rgba(200,153,255,0.08)'}`,
                borderRadius: 16, padding: 20, opacity: acc.isActive ? 1 : 0.5
              }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 14 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  {/* Status dot */}
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: acc.isActive ? (isCritical ? '#ef4444' : isWarning ? '#f59e0b' : '#22c55e') : '#555', flexShrink: 0, boxShadow: acc.isActive ? `0 0 8px ${isCritical ? '#ef4444' : isWarning ? '#f59e0b' : '#22c55e'}` : 'none' }} />
                  <div>
                    <div style={{ fontWeight: 700, color: '#fff', fontSize: 15, fontFamily: 'Plus Jakarta Sans, sans-serif' }}>{acc.name}</div>
                    <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', marginTop: 2 }}>
                      {acc.cloudName} · Приоритет {acc.priority} · {acc.totalUploads} загрузок
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: 6 }}>
                  <IconBtn onClick={() => handleSync(acc._id)} title="Синхронизировать с Cloudinary"
                    loading={syncing === acc._id} color="rgba(200,153,255,0.7)">
                    <RefreshCw size={14} />
                  </IconBtn>
                  <IconBtn onClick={() => setEditAccount(acc)} title="Редактировать" color="rgba(255,255,255,0.4)">
                    <Edit3 size={14} />
                  </IconBtn>
                  <IconBtn onClick={() => handleToggle(acc._id)} title={acc.isActive ? 'Отключить' : 'Включить'}
                    loading={toggling === acc._id} color={acc.isActive ? '#22c55e' : 'rgba(255,255,255,0.25)'}>
                    <Power size={14} />
                  </IconBtn>
                  <IconBtn onClick={() => handleDelete(acc._id, acc.name)} title="Удалить" color="rgba(239,68,68,0.6)">
                    <Trash2 size={14} />
                  </IconBtn>
                </div>
              </div>

              {/* Usage bar */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: 12 }}>
                  <span style={{ color: 'rgba(255,255,255,0.4)' }}>
                    {formatBytes(acc.usageBytes)} / {formatBytes(acc.limitBytes)}
                  </span>
                  <span style={{ fontWeight: 700, color: isCritical ? '#ef4444' : isWarning ? '#f59e0b' : '#34d399' }}>
                    {pct}%
                    {isCritical && ' ⚠️ Критично'}
                    {isWarning && !isCritical && ' ⚡ Предупреждение'}
                  </span>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: 6, height: 6, overflow: 'hidden' }}>
                  <div style={{
                    height: '100%', borderRadius: 6,
                    width: `${pct}%`, transition: 'width 0.4s ease',
                    background: isCritical ? 'linear-gradient(90deg,#f59e0b,#ef4444)' : isWarning ? '#f59e0b' : 'linear-gradient(90deg,#c899ff,#9592ff)'
                  }} />
                </div>
              </div>

              {acc.notes && (
                <div style={{ marginTop: 10, fontSize: 11, color: 'rgba(255,255,255,0.25)', fontStyle: 'italic' }}>
                  📝 {acc.notes}
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Add / Edit modal */}
      <AnimatePresence>
        {(showAdd || editAccount) && (
          <CloudAccountModal
            account={editAccount}
            onClose={() => { setShowAdd(false); setEditAccount(null); }}
            onSaved={() => { setShowAdd(false); setEditAccount(null); showToast(editAccount ? 'Аккаунт обновлён' : 'Аккаунт добавлен'); onRefresh(); }}
            showToast={showToast}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CLOUD ACCOUNT MODAL
// ─────────────────────────────────────────────────────────────────────────────
function CloudAccountModal({ account, onClose, onSaved, showToast }: {
  account: CloudAccount | null;
  onClose: () => void;
  onSaved: () => void;
  showToast: (msg: string, type?: any) => void;
}) {
  const [form, setForm] = useState({
    name: account?.name || '',
    cloudName: account?.cloudName || '',
    apiKey: account?.apiKey || '',
    apiSecret: account?.apiSecret || '',
    limitBytes: account?.limitBytes || 26843545600,
    priority: account?.priority ?? 0,
    notes: account?.notes || '',
  });
  const [loading, setLoading] = useState(false);
  const [showSecret, setShowSecret] = useState(false);

  const update = (key: string, val: any) => setForm(f => ({ ...f, [key]: val }));

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (account) {
        await adminAPI.updateCloudAccount(account._id, form);
      } else {
        await adminAPI.addCloudAccount(form);
      }
      onSaved();
    } catch (err: any) { showToast(err.message, 'error'); }
    setLoading(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, backdropFilter: 'blur(8px)' }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
        style={{ width: '100%', maxWidth: 480, background: '#15151d', border: '1px solid rgba(200,153,255,0.15)', borderRadius: 20, padding: 32, boxShadow: '0 32px 80px rgba(0,0,0,0.6)' }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <div style={{ fontSize: 18, fontWeight: 800, color: '#fff', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
            {account ? 'Редактировать аккаунт' : 'Добавить облачный аккаунт'}
          </div>
          <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.06)', border: 'none', borderRadius: 8, width: 30, height: 30, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'rgba(255,255,255,0.5)' }}><X size={16} /></button>
        </div>

        <form onSubmit={handleSave}>
          <Field label="Название аккаунта" value={form.name} onChange={v => update('name', v)} placeholder="Аккаунт #1" />
          <Field label="Cloud Name (из Cloudinary Dashboard)" value={form.cloudName} onChange={v => update('cloudName', v)} placeholder="my-cloud-name" />
          <Field label="API Key" value={form.apiKey} onChange={v => update('apiKey', v)} placeholder="123456789012345" />

          <div style={{ marginBottom: 16, position: 'relative' }}>
            <label style={labelStyle}>API Secret</label>
            <input
              type={showSecret ? 'text' : 'password'}
              value={form.apiSecret}
              onChange={e => update('apiSecret', e.target.value)}
              placeholder="xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
              style={{ ...inputStyle, paddingRight: 44 }}
              required={!account}
            />
            <button type="button" onClick={() => setShowSecret(!showSecret)}
              style={{ position: 'absolute', right: 14, top: 38, background: 'none', border: 'none', color: 'rgba(255,255,255,0.3)', cursor: 'pointer' }}>
              {showSecret ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={labelStyle}>Лимит хранилища (GB)</label>
              <input
                type="number" min={1} max={1000}
                value={Math.round(form.limitBytes / (1024 ** 3))}
                onChange={e => update('limitBytes', Number(e.target.value) * 1024 ** 3)}
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>Приоритет (0 = первый)</label>
              <input
                type="number" min={0} max={100}
                value={form.priority}
                onChange={e => update('priority', Number(e.target.value))}
                style={inputStyle}
              />
            </div>
          </div>

          <div style={{ marginBottom: 20 }}>
            <label style={labelStyle}>Заметки (необязательно)</label>
            <textarea
              value={form.notes}
              onChange={e => update('notes', e.target.value)}
              placeholder="Например: основной аккаунт, создан 2025-01"
              rows={2}
              style={{ ...inputStyle, resize: 'none' }}
            />
          </div>

          <div style={{ display: 'flex', gap: 10 }}>
            <button type="button" onClick={onClose}
              style={{ flex: 1, padding: '12px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, color: 'rgba(255,255,255,0.5)', fontWeight: 600, fontSize: 13, cursor: 'pointer' }}>
              Отмена
            </button>
            <motion.button whileTap={{ scale: 0.97 }} type="submit" disabled={loading}
              style={{ flex: 2, padding: '12px', background: 'linear-gradient(135deg,#c899ff,#9592ff)', border: 'none', borderRadius: 10, color: '#fff', fontWeight: 700, fontSize: 13, cursor: 'pointer', opacity: loading ? 0.7 : 1 }}>
              {loading ? 'Сохранение...' : account ? 'Сохранить изменения' : 'Добавить аккаунт'}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// USERS TAB
// ─────────────────────────────────────────────────────────────────────────────
function UsersTab({ users, showToast, onRefresh }: { users: AdminUser[]; showToast: any; onRefresh: () => void }) {
  const handleBan = async (id: string, ban: boolean, username: string) => {
    if (!confirm(`${ban ? 'Заблокировать' : 'Разблокировать'} @${username}?`)) return;
    try {
      const res = await adminAPI.banUser(id, ban);
      showToast(res.message);
      onRefresh();
    } catch (e: any) { showToast(e.message, 'error'); }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: '#fff', fontFamily: 'Plus Jakarta Sans, sans-serif', letterSpacing: '-0.5px' }}>Пользователи</h1>
        <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginTop: 4 }}>Управление аккаунтами пользователей</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {users.map(u => (
          <div key={u._id} style={{ display: 'flex', alignItems: 'center', gap: 14, background: 'rgba(21,21,29,0.8)', border: '1px solid rgba(200,153,255,0.08)', borderRadius: 12, padding: '14px 18px', opacity: u.isBanned ? 0.5 : 1 }}>
            <div style={{ width: 38, height: 38, borderRadius: '50%', background: 'linear-gradient(135deg,#c899ff,#9592ff)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, color: '#fff', flexShrink: 0 }}>
              {u.username[0]?.toUpperCase()}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 700, color: '#fff', fontSize: 14 }}>@{u.username}</div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)' }}>
                👁 {u.popularityScore?.totalViews ?? 0} · ❤️ {u.popularityScore?.totalLikes ?? 0} · {u.isOnline ? '🟢 онлайн' : '⚫ офлайн'}
              </div>
            </div>
            <button
              onClick={() => handleBan(u._id, !u.isBanned, u.username)}
              style={{
                padding: '7px 14px', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 600,
                background: u.isBanned ? 'rgba(34,197,94,0.12)' : 'rgba(239,68,68,0.1)',
                color: u.isBanned ? '#86efac' : '#fca5a5',
              }}>
              {u.isBanned ? 'Разблокировать' : 'Заблокировать'}
            </button>
          </div>
        ))}
        {users.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: 'rgba(255,255,255,0.25)' }}>
            <Users size={40} style={{ marginBottom: 12, opacity: 0.3 }} />
            <p>Нет пользователей</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SHARED UI COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────
const labelStyle: React.CSSProperties = {
  display: 'block', fontSize: 11, color: 'rgba(255,255,255,0.4)',
  fontWeight: 600, marginBottom: 6, letterSpacing: '0.3px', textTransform: 'uppercase'
};

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '11px 14px', background: 'rgba(255,255,255,0.05)',
  border: '1px solid rgba(200,153,255,0.15)', borderRadius: 10, color: '#fff',
  fontSize: 13, fontFamily: 'Manrope, sans-serif', outline: 'none',
};

function Field({ label, value, onChange, type = 'text', placeholder = '' }: {
  label: string; value: string; onChange: (v: string) => void; type?: string; placeholder?: string;
}) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={labelStyle}>{label}</label>
      <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} style={inputStyle}
        onFocus={e => (e.target.style.borderColor = 'rgba(200,153,255,0.5)')}
        onBlur={e => (e.target.style.borderColor = 'rgba(200,153,255,0.15)')}
        required />
    </div>
  );
}

function IconBtn({ children, onClick, title, color, loading: isLoading }: {
  children: React.ReactNode; onClick: () => void; title: string; color: string; loading?: boolean;
}) {
  return (
    <motion.button whileTap={{ scale: 0.9 }} onClick={onClick} title={title}
      style={{ width: 30, height: 30, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color, opacity: isLoading ? 0.5 : 1 }}>
      <div style={{ animation: isLoading ? 'spin 1s linear infinite' : 'none' }}>{children}</div>
    </motion.button>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ROOT EXPORT
// ─────────────────────────────────────────────────────────────────────────────
export default function AdminApp() {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      adminAPI.me()
        .then(res => setAdmin(res.admin))
        .catch(() => localStorage.removeItem('adminToken'))
        .finally(() => setChecking(false));
    } else {
      setChecking(false);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    setAdmin(null);
  };

  if (checking) return (
    <div style={{ minHeight: '100vh', background: '#0e0e13', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: 36, height: 36, border: '3px solid rgba(200,153,255,0.2)', borderTop: '3px solid #c899ff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
    </div>
  );

  return admin
    ? <AdminPanel admin={admin} onLogout={handleLogout} />
    : <AdminLogin onLogin={(_, a) => setAdmin(a)} />;
}
