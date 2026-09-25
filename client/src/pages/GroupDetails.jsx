import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  getGroupDetails,
  getGroupExpenses,
  getGroupBalances,
  getGroupSettlements,
  getGroupActivity,
  deleteExpense as apiDeleteExpense,
  deleteGroup as apiDeleteGroup,
  removeMember as apiRemoveMember,
  recordSettlement as apiRecordSettlement,
} from '../services/api';
import {
  ArrowLeft,
  Plus,
  Users,
  Receipt,
  Scale,
  History,
  UserPlus,
  Trash2,
  Calendar,
  Shield,
  ArrowUpRight,
  ArrowDownLeft,
  CheckCircle2,
  Sparkles,
  AlertCircle,
  Clock,
  Check,
} from 'lucide-react';
import ExpenseCard from '../components/ExpenseCard';
import BalanceCard from '../components/BalanceCard';
import SettlementList from '../components/SettlementList';
import MemberList from '../components/MemberList';
import AddMemberModal from '../components/AddMemberModal';
import AddExpenseModal from '../components/AddExpenseModal';
import ExpenseDetailsModal from '../components/ExpenseDetailsModal';
import SettleUpModal from '../components/SettleUpModal';

export default function GroupDetails() {
  const { groupId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [group, setGroup] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [balanceData, setBalanceData] = useState(null);
  const [settlementsHistory, setSettlementsHistory] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expensesLoading, setExpensesLoading] = useState(false);
  const [balancesLoading, setBalancesLoading] = useState(false);
  const [activitiesLoading, setActivitiesLoading] = useState(false);
  const [error, setError] = useState('');

  // Modals
  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [selectedExpenseId, setSelectedExpenseId] = useState(null);
  const [settlementToMark, setSettlementToMark] = useState(null);

  const [activeTab, setActiveTab] = useState('expenses');

  const fetchGroupInfo = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getGroupDetails(groupId);
      setGroup(data.group);
    } catch (err) {
      setError(err.message || 'Failed to load group details.');
    } finally {
      setLoading(false);
    }
  };

  const fetchExpenses = async () => {
    setExpensesLoading(true);
    try {
      const data = await getGroupExpenses(groupId);
      setExpenses(data.expenses || []);
    } catch (err) {
      console.error('Failed to load expenses:', err.message);
    } finally {
      setExpensesLoading(false);
    }
  };

  const fetchBalancesAndSettlements = async () => {
    setBalancesLoading(true);
    try {
      const [balData, settData] = await Promise.all([
        getGroupBalances(groupId),
        getGroupSettlements(groupId),
      ]);
      setBalanceData(balData);
      setSettlementsHistory(settData.settlements || []);
    } catch (err) {
      console.error('Failed to load balances:', err.message);
    } finally {
      setBalancesLoading(false);
    }
  };

  const fetchActivities = async () => {
    setActivitiesLoading(true);
    try {
      const data = await getGroupActivity(groupId);
      setActivities(data.activities || []);
    } catch (err) {
      console.error('Failed to load activity:', err.message);
    } finally {
      setActivitiesLoading(false);
    }
  };

  useEffect(() => {
    fetchGroupInfo();
    fetchExpenses();
    fetchBalancesAndSettlements();
  }, [groupId]);

  useEffect(() => {
    if (activeTab === 'activity') {
      fetchActivities();
    }
  }, [activeTab, groupId]);

  const handleAddMember = async (email) => {
    await fetchGroupInfo();
    await fetchBalancesAndSettlements();
  };

  const handleRemoveMember = async (userId) => {
    try {
      await apiRemoveMember(groupId, userId);
      if (userId === user?.id) {
        navigate('/groups');
      } else {
        await fetchGroupInfo();
        await fetchBalancesAndSettlements();
      }
    } catch (err) {
      alert(err.message || 'Failed to remove member');
    }
  };

  const handleExpenseAdded = async () => {
    await fetchExpenses();
    await fetchBalancesAndSettlements();
  };

  const handleDeleteExpense = async (expenseId) => {
    try {
      await apiDeleteExpense(expenseId);
      await fetchExpenses();
      await fetchBalancesAndSettlements();
    } catch (err) {
      alert(err.message || 'Failed to delete expense');
    }
  };

  const handleConfirmSettlement = async (settlementPayload) => {
    await apiRecordSettlement(groupId, settlementPayload);
    await fetchBalancesAndSettlements();
  };

  const handleDeleteGroup = async () => {
    if (!window.confirm(`Are you sure you want to permanently delete the group "${group.name}"?`)) {
      return;
    }

    try {
      await apiDeleteGroup(groupId);
      navigate('/groups');
    } catch (err) {
      alert(err.message || 'Failed to delete group');
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '6rem 0' }}>
        <div className="spinner" style={{ width: '2.5rem', height: '2.5rem' }}></div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ maxWidth: '600px', margin: '3rem auto' }}>
        <div className="card" style={{ textAlign: 'center', padding: '2.5rem 1.5rem' }}>
          <AlertCircle size={40} color="var(--danger)" style={{ marginBottom: '1rem' }} />
          <h2 style={{ fontSize: '1.35rem', fontWeight: 700 }}>Unable to Open Group</h2>
          <p className="text-muted mt-1">{error}</p>
          <Link to="/groups" className="btn btn-primary mt-3">
            <ArrowLeft size={16} /> Back to Your Groups
          </Link>
        </div>
      </div>
    );
  }

  const isCreator = group?.created_by === user?.id;
  const formattedDate = new Date(group.created_at).toLocaleDateString(undefined, {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const currentUserSummary = balanceData?.currentUserSummary;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Back button */}
      <Link
        to="/groups"
        className="text-muted"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.4rem',
          textDecoration: 'none',
          fontSize: '0.9rem',
          transition: 'color var(--transition-fast)',
        }}
      >
        <ArrowLeft size={16} /> Back to Groups
      </Link>

      {/* Group Header Card (Glassmorphism) */}
      <div className="glass-card" style={{ padding: '2rem 2.25rem' }}>
        <div className="flex-between" style={{ flexWrap: 'wrap', gap: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <div
              style={{
                width: '60px',
                height: '60px',
                borderRadius: '16px',
                background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: '1.75rem',
                boxShadow: '0 0 20px rgba(124, 92, 252, 0.4)',
              }}
            >
              {group.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                <h1 style={{ fontSize: '1.85rem', fontWeight: 800 }}>{group.name}</h1>
                {isCreator && (
                  <span className="badge badge-warning" style={{ fontSize: '0.72rem' }}>
                    Creator
                  </span>
                )}
                <span className="badge badge-primary" style={{ fontSize: '0.72rem' }}>
                  {group.members?.length || 0} Members
                </span>
              </div>
              <div className="text-muted" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', fontSize: '0.85rem', marginTop: '0.35rem', flexWrap: 'wrap' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Shield size={14} color="var(--primary)" /> Created by <strong>{group.creator_name}</strong>
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Calendar size={14} /> {formattedDate}
                </span>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            <button className="btn btn-primary" onClick={() => setIsExpenseModalOpen(true)}>
              <Plus size={16} />
              <span>Add Expense</span>
            </button>
            <button className="btn btn-secondary" onClick={() => setIsMemberModalOpen(true)}>
              <UserPlus size={16} />
              <span>Invite Friend</span>
            </button>
            {isCreator && (
              <button
                className="btn btn-danger btn-icon"
                onClick={handleDeleteGroup}
                title="Delete this group"
              >
                <Trash2 size={16} />
              </button>
            )}
          </div>
        </div>

        {/* Tab Switcher */}
        <div
          style={{
            display: 'flex',
            gap: '0.5rem',
            marginTop: '1.75rem',
            borderTop: '1px solid var(--border)',
            paddingTop: '1.25rem',
            overflowX: 'auto',
          }}
        >
          <button
            onClick={() => setActiveTab('expenses')}
            className={`btn btn-sm ${activeTab === 'expenses' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ fontWeight: 700 }}
          >
            <Receipt size={15} />
            <span>Expenses ({expenses.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('balances')}
            className={`btn btn-sm ${activeTab === 'balances' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ fontWeight: 700 }}
          >
            <Scale size={15} />
            <span>Balances & Settlements</span>
          </button>
          <button
            onClick={() => setActiveTab('members')}
            className={`btn btn-sm ${activeTab === 'members' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ fontWeight: 700 }}
          >
            <Users size={15} />
            <span>Members ({group.members?.length || 0})</span>
          </button>
          <button
            onClick={() => setActiveTab('activity')}
            className={`btn btn-sm ${activeTab === 'activity' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ fontWeight: 700 }}
          >
            <History size={15} />
            <span>Activity Feed</span>
          </button>
        </div>
      </div>

      {/* Tab Content: EXPENSES */}
      {activeTab === 'expenses' && (
        <div>
          <div className="flex-between" style={{ marginBottom: '1.15rem' }}>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Group Expenses</h3>
              <p className="text-muted" style={{ fontSize: '0.85rem' }}>
                All shared bills and expenses recorded in this group
              </p>
            </div>
            <button className="btn btn-primary btn-sm" onClick={() => setIsExpenseModalOpen(true)}>
              <Plus size={14} />
              <span>Add Expense</span>
            </button>
          </div>

          {expensesLoading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem 0' }}>
              <div className="spinner" style={{ width: '2rem', height: '2rem' }}></div>
            </div>
          ) : expenses.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '4rem 1.5rem' }}>
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  background: 'var(--primary-subtle)',
                  color: 'var(--primary-hover)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1rem',
                  boxShadow: '0 0 15px rgba(124, 92, 252, 0.3)',
                }}
              >
                <Receipt size={28} />
              </div>
              <h4 style={{ fontSize: '1.2rem', fontWeight: 700 }}>No expenses recorded yet</h4>
              <p className="text-muted mt-1" style={{ fontSize: '0.88rem', maxWidth: '420px', margin: '0.5rem auto 1.5rem' }}>
                Start tracking by recording your first group bill (dinner, cabs, stay, groceries).
              </p>
              <button className="btn btn-primary" onClick={() => setIsExpenseModalOpen(true)}>
                <Plus size={16} /> Add First Expense
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {expenses.map((expense) => (
                <ExpenseCard
                  key={expense.id}
                  expense={expense}
                  currentUserId={user?.id}
                  isGroupCreator={isCreator}
                  onViewDetails={(id) => setSelectedExpenseId(id)}
                  onDelete={handleDeleteExpense}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab Content: BALANCES & SETTLEMENTS */}
      {activeTab === 'balances' && (
        <div>
          {balancesLoading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem 0' }}>
              <div className="spinner" style={{ width: '2rem', height: '2rem' }}></div>
            </div>
          ) : (
            <div>
              {/* Personal Standing in Group Banner */}
              {currentUserSummary && (
                <div
                  className="card"
                  style={{
                    marginBottom: '1.75rem',
                    background:
                      currentUserSummary.netBalance > 0
                        ? 'linear-gradient(180deg, #10131F 0%, #111A24 100%)'
                        : currentUserSummary.netBalance < 0
                        ? 'linear-gradient(180deg, #10131F 0%, #1E121B 100%)'
                        : 'var(--surface)',
                    border:
                      currentUserSummary.netBalance > 0
                        ? '1px solid rgba(53, 224, 161, 0.3)'
                        : currentUserSummary.netBalance < 0
                        ? '1px solid rgba(255, 100, 124, 0.3)'
                        : '1px solid var(--border)',
                  }}
                >
                  <div className="flex-between" style={{ flexWrap: 'wrap', gap: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                      <div
                        style={{
                          width: '50px',
                          height: '50px',
                          borderRadius: '50%',
                          backgroundColor:
                            currentUserSummary.netBalance > 0
                              ? 'var(--success-dark)'
                              : currentUserSummary.netBalance < 0
                              ? 'var(--danger-dark)'
                              : 'var(--surface-elevated)',
                          color:
                            currentUserSummary.netBalance > 0
                              ? 'var(--success)'
                              : currentUserSummary.netBalance < 0
                              ? 'var(--danger)'
                              : 'var(--text-muted)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          boxShadow:
                            currentUserSummary.netBalance > 0
                              ? '0 0 15px rgba(53, 224, 161, 0.3)'
                              : currentUserSummary.netBalance < 0
                              ? '0 0 15px rgba(255, 100, 124, 0.3)'
                              : 'none',
                        }}
                      >
                        {currentUserSummary.netBalance > 0 ? (
                          <ArrowUpRight size={26} />
                        ) : currentUserSummary.netBalance < 0 ? (
                          <ArrowDownLeft size={26} />
                        ) : (
                          <CheckCircle2 size={26} />
                        )}
                      </div>

                      <div>
                        <span className="text-muted" style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                          Your Standing in this Group
                        </span>
                        <div className="finance-number" style={{ fontSize: '1.65rem', marginTop: '3px' }}>
                          {currentUserSummary.netBalance > 0 ? (
                            <span style={{ color: 'var(--success)' }}>
                              You are owed ₹{currentUserSummary.netBalance.toFixed(2)}
                            </span>
                          ) : currentUserSummary.netBalance < 0 ? (
                            <span style={{ color: 'var(--danger)' }}>
                              You owe ₹{Math.abs(currentUserSummary.netBalance).toFixed(2)}
                            </span>
                          ) : (
                            <span>All settled up</span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div style={{ textAlign: 'right', fontSize: '0.85rem' }} className="text-muted">
                      <div>Total Paid by You: <strong style={{ color: 'var(--text-main)' }}>₹{currentUserSummary.totalPaid.toFixed(2)}</strong></div>
                      <div>Your Total Share: <strong style={{ color: 'var(--text-main)' }}>₹{currentUserSummary.totalOwed.toFixed(2)}</strong></div>
                    </div>
                  </div>
                </div>
              )}

              {/* Suggested Settlements Section */}
              <div style={{ marginBottom: '2.5rem' }}>
                <div className="flex-between" style={{ marginBottom: '1rem' }}>
                  <div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Suggested Settlements (Who Owes Whom)</h3>
                    <p className="text-muted" style={{ fontSize: '0.85rem' }}>
                      Minimized debt transfers calculated by FairShare algorithm
                    </p>
                  </div>
                  <span className="badge badge-primary">
                    <Sparkles size={11} /> Minimized Debts
                  </span>
                </div>

                <SettlementList
                  settlements={balanceData?.suggestedSettlements || []}
                  currentUserId={user?.id}
                  onMarkPaid={(s) => setSettlementToMark(s)}
                />
              </div>

              {/* Individual Member Balances Grid */}
              <div style={{ marginBottom: '2.5rem' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem' }}>
                  Individual Member Balances
                </h3>
                <div className="grid-2">
                  {balanceData?.balances?.map((b) => (
                    <BalanceCard
                      key={b.userId}
                      balance={b}
                      isCurrentUser={b.userId === user?.id}
                    />
                  ))}
                </div>
              </div>

              {/* Payment & Settlement History Log */}
              {settlementsHistory.length > 0 && (
                <div className="card">
                  <div className="flex-between" style={{ marginBottom: '1.25rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <History size={18} color="var(--primary)" />
                      <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Payment & Settlement History</h3>
                    </div>
                    <span className="badge badge-success">
                      {settlementsHistory.length} recorded
                    </span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                    {settlementsHistory.map((sh) => (
                      <div
                        key={sh.id}
                        className="flex-between"
                        style={{
                          padding: '0.85rem 1.15rem',
                          background: 'var(--surface-elevated)',
                          borderRadius: 'var(--radius-sm)',
                          border: '1px solid var(--border)',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                          <div
                            style={{
                              width: '28px',
                              height: '28px',
                              borderRadius: '50%',
                              background: 'var(--success-subtle)',
                              color: 'var(--success)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            <Check size={16} />
                          </div>
                          <span style={{ fontSize: '0.92rem', color: 'var(--text-main)' }}>
                            <strong>{sh.payer_name}</strong> paid <strong>{sh.receiver_name}</strong>
                          </span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                          <span className="finance-number" style={{ fontSize: '1.1rem', color: 'var(--success)' }}>
                            ₹{Number(sh.amount).toFixed(2)}
                          </span>
                          <span className="text-muted" style={{ fontSize: '0.78rem' }}>
                            {new Date(sh.settled_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Tab Content: MEMBERS */}
      {activeTab === 'members' && (
        <div className="card">
          <div className="flex-between" style={{ marginBottom: '1.5rem' }}>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Group Members</h3>
              <p className="text-muted" style={{ fontSize: '0.85rem' }}>
                People sharing expenses in this group
              </p>
            </div>
            <button className="btn btn-primary btn-sm" onClick={() => setIsMemberModalOpen(true)}>
              <UserPlus size={14} />
              <span>Invite Friend</span>
            </button>
          </div>

          <MemberList
            members={group.members}
            currentUser={user}
            creatorId={group.created_by}
            isCreator={isCreator}
            onRemoveMember={handleRemoveMember}
          />
        </div>
      )}

      {/* Tab Content: ACTIVITY */}
      {activeTab === 'activity' && (
        <div className="card">
          <div className="flex-between" style={{ marginBottom: '1.5rem' }}>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Group Activity Feed</h3>
              <p className="text-muted" style={{ fontSize: '0.85rem' }}>
                Chronological timeline of bills, repayments, and new members
              </p>
            </div>
            <button className="btn btn-secondary btn-sm" onClick={fetchActivities} disabled={activitiesLoading}>
              <History size={14} className={activitiesLoading ? 'spinner' : ''} />
              <span>Refresh</span>
            </button>
          </div>

          {activitiesLoading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem 0' }}>
              <div className="spinner" style={{ width: '2rem', height: '2rem' }}></div>
            </div>
          ) : activities.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
              <History size={32} color="var(--primary)" style={{ marginBottom: '0.5rem', opacity: 0.7 }} />
              <p className="text-muted">No activity recorded in this group yet.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {activities.map((act) => (
                <div
                  key={act.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    padding: '0.85rem 1.15rem',
                    background: 'var(--surface-elevated)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-sm)',
                  }}
                >
                  <div
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      background:
                        act.action_type === 'EXPENSE_ADDED'
                          ? 'var(--primary-subtle)'
                          : act.action_type === 'SETTLEMENT_RECORDED'
                          ? 'var(--success-subtle)'
                          : 'var(--secondary-subtle)',
                      color:
                        act.action_type === 'EXPENSE_ADDED'
                          ? 'var(--primary-hover)'
                          : act.action_type === 'SETTLEMENT_RECORDED'
                          ? 'var(--success)'
                          : 'var(--secondary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {act.action_type === 'EXPENSE_ADDED' ? (
                      <Receipt size={18} />
                    ) : act.action_type === 'SETTLEMENT_RECORDED' ? (
                      <Check size={18} />
                    ) : (
                      <Users size={18} />
                    )}
                  </div>

                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: '0.92rem', color: 'var(--text-main)', margin: 0 }}>
                      {act.description}
                    </p>
                    <span className="text-muted" style={{ fontSize: '0.78rem' }}>
                      {new Date(act.created_at).toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Modals */}
      <AddMemberModal
        isOpen={isMemberModalOpen}
        onClose={() => setIsMemberModalOpen(false)}
        onAddMember={handleAddMember}
        groupName={group.name}
      />

      <AddExpenseModal
        groupId={groupId}
        members={group.members}
        isOpen={isExpenseModalOpen}
        onClose={() => setIsExpenseModalOpen(false)}
        onExpenseAdded={handleExpenseAdded}
      />

      <ExpenseDetailsModal
        expenseId={selectedExpenseId}
        isOpen={!!selectedExpenseId}
        onClose={() => setSelectedExpenseId(null)}
      />

      <SettleUpModal
        settlement={settlementToMark}
        isOpen={!!settlementToMark}
        onClose={() => setSettlementToMark(null)}
        onConfirm={handleConfirmSettlement}
        currentUserId={user?.id}
      />
    </div>
  );
}
