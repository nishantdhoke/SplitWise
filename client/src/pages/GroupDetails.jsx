import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  getGroupDetails,
  addMember as apiAddMember,
  removeMember as apiRemoveMember,
  deleteGroup as apiDeleteGroup,
  getGroupExpenses,
  deleteExpense as apiDeleteExpense,
  getGroupBalances,
  getGroupSettlements,
  recordSettlement as apiRecordSettlement,
  getGroupActivity,
} from '../services/api';
import MemberList from '../components/MemberList';
import AddMemberModal from '../components/AddMemberModal';
import ExpenseCard from '../components/ExpenseCard';
import AddExpenseModal from '../components/AddExpenseModal';
import ExpenseDetailsModal from '../components/ExpenseDetailsModal';
import BalanceCard from '../components/BalanceCard';
import SettlementList from '../components/SettlementList';
import SettleUpModal from '../components/SettleUpModal';
import {
  ArrowLeft,
  UserPlus,
  Users,
  Receipt,
  Scale,
  Trash2,
  AlertCircle,
  Calendar,
  Shield,
  Plus,
  ArrowUpRight,
  ArrowDownLeft,
  CheckCircle2,
  Sparkles,
  History,
  Check,
} from 'lucide-react';

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
      console.error('Failed to load balances & settlements:', err.message);
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
      console.error('Failed to load activities:', err.message);
    } finally {
      setActivitiesLoading(false);
    }
  };

  useEffect(() => {
    fetchGroupInfo();
    fetchExpenses();
    fetchBalancesAndSettlements();
    fetchActivities();
  }, [groupId]);

  const handleAddMember = async (email) => {
    const data = await apiAddMember(groupId, email);
    setGroup((prev) => ({
      ...prev,
      members: data.members,
    }));
    await fetchBalancesAndSettlements();
  };

  const handleRemoveMember = async (userId) => {
    try {
      const data = await apiRemoveMember(groupId, userId);
      if (userId === user.id) {
        navigate('/groups');
      } else {
        setGroup((prev) => ({
          ...prev,
          members: data.members,
        }));
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
      <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem 0' }}>
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
    <div>
      {/* Back button */}
      <Link to="/groups" className="text-muted" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', textDecoration: 'none', marginBottom: '1.25rem', fontSize: '0.9rem' }}>
        <ArrowLeft size={16} /> Back to Groups
      </Link>

      {/* Group Header Card */}
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <div className="flex-between" style={{ flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div
              style={{
                width: '54px',
                height: '54px',
                borderRadius: '12px',
                backgroundColor: 'var(--primary)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: '1.5rem',
              }}
            >
              {group.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <h1 style={{ fontSize: '1.6rem', fontWeight: 700 }}>{group.name}</h1>
                {isCreator && (
                  <span className="badge badge-warning" style={{ fontSize: '0.7rem' }}>
                    You're Creator
                  </span>
                )}
              </div>
              <div className="text-muted" style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.85rem', marginTop: '0.25rem' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <Shield size={14} /> Created by {group.creator_name}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <Calendar size={14} /> {formattedDate}
                </span>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button className="btn btn-primary" onClick={() => setIsExpenseModalOpen(true)}>
              <Plus size={16} />
              Add Expense
            </button>
            <button className="btn btn-secondary" onClick={() => setIsMemberModalOpen(true)}>
              <UserPlus size={16} />
              Add Member
            </button>
            {isCreator && (
              <button
                className="btn btn-secondary"
                onClick={handleDeleteGroup}
                style={{ color: 'var(--danger)', borderColor: '#fecaca' }}
                title="Delete this group"
              >
                <Trash2 size={16} />
              </button>
            )}
          </div>
        </div>

        {/* Tab Navigation */}
        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1.5rem', borderTop: '1px solid var(--border)', paddingTop: '1rem' }}>
          <button
            onClick={() => setActiveTab('expenses')}
            className={`btn ${activeTab === 'expenses' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ padding: '0.45rem 1rem', fontSize: '0.88rem' }}
          >
            <Receipt size={15} />
            Expenses ({expenses.length})
          </button>
          <button
            onClick={() => setActiveTab('balances')}
            className={`btn ${activeTab === 'balances' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ padding: '0.45rem 1rem', fontSize: '0.88rem' }}
          >
            <Scale size={15} />
            Balances & Settlements
          </button>
          <button
            onClick={() => setActiveTab('members')}
            className={`btn ${activeTab === 'members' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ padding: '0.45rem 1rem', fontSize: '0.88rem' }}
          >
            <Users size={15} />
            Members ({group.members?.length || 0})
          </button>
          <button
            onClick={() => setActiveTab('activity')}
            className={`btn ${activeTab === 'activity' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ padding: '0.45rem 1rem', fontSize: '0.88rem' }}
          >
            <History size={15} />
            Activity
          </button>
        </div>
      </div>

      {/* Tab Content: EXPENSES */}
      {activeTab === 'expenses' && (
        <div>
          <div className="flex-between" style={{ marginBottom: '1rem' }}>
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 600 }}>Group Expenses</h3>
              <p className="text-muted" style={{ fontSize: '0.85rem' }}>
                All shared bills and expenses recorded in this group
              </p>
            </div>
            <button className="btn btn-primary" onClick={() => setIsExpenseModalOpen(true)} style={{ fontSize: '0.85rem' }}>
              <Plus size={14} />
              Record Expense
            </button>
          </div>

          {expensesLoading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem 0' }}>
              <div className="spinner" style={{ width: '2rem', height: '2rem' }}></div>
            </div>
          ) : expenses.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '3.5rem 1.5rem' }}>
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--primary-light)',
                  color: 'var(--primary)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1rem',
                }}
              >
                <Receipt size={28} />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 600 }}>No Expenses Yet</h3>
              <p className="text-muted mt-1" style={{ fontSize: '0.9rem', maxWidth: '420px', margin: '0.5rem auto' }}>
                Nobody has recorded an expense in this group yet. Add the first expense to start splitting!
              </p>
              <button className="btn btn-primary mt-3" onClick={() => setIsExpenseModalOpen(true)}>
                <Plus size={15} /> Add First Expense
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
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
            <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem 0' }}>
              <div className="spinner" style={{ width: '2rem', height: '2rem' }}></div>
            </div>
          ) : (
            <div>
              {/* User Standing Hero Banner */}
              {currentUserSummary && (
                <div
                  className="card"
                  style={{
                    marginBottom: '1.5rem',
                    background:
                      currentUserSummary.netBalance > 0
                        ? '#ecfdf5'
                        : currentUserSummary.netBalance < 0
                        ? '#fef2f2'
                        : '#f8fafc',
                    borderColor:
                      currentUserSummary.netBalance > 0
                        ? '#a7f3d0'
                        : currentUserSummary.netBalance < 0
                        ? '#fecaca'
                        : 'var(--border)',
                  }}
                >
                  <div className="flex-between" style={{ flexWrap: 'wrap', gap: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <div
                        style={{
                          width: '46px',
                          height: '46px',
                          borderRadius: '50%',
                          backgroundColor:
                            currentUserSummary.netBalance > 0
                              ? '#d1fae5'
                              : currentUserSummary.netBalance < 0
                              ? '#fee2e2'
                              : '#e2e8f0',
                          color:
                            currentUserSummary.netBalance > 0
                              ? 'var(--success)'
                              : currentUserSummary.netBalance < 0
                              ? 'var(--danger)'
                              : 'var(--text-muted)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        {currentUserSummary.netBalance > 0 ? (
                          <ArrowUpRight size={24} />
                        ) : currentUserSummary.netBalance < 0 ? (
                          <ArrowDownLeft size={24} />
                        ) : (
                          <CheckCircle2 size={24} />
                        )}
                      </div>

                      <div>
                        <span className="text-muted" style={{ fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase' }}>
                          Your Standing in this Group
                        </span>
                        <div style={{ fontSize: '1.5rem', fontWeight: 700, marginTop: '2px' }}>
                          {currentUserSummary.netBalance > 0 ? (
                            <span style={{ color: 'var(--success)' }}>
                              You are owed ₹{currentUserSummary.netBalance.toFixed(2)}
                            </span>
                          ) : currentUserSummary.netBalance < 0 ? (
                            <span style={{ color: 'var(--danger)' }}>
                              You owe ₹{Math.abs(currentUserSummary.netBalance).toFixed(2)}
                            </span>
                          ) : (
                            <span>You are all settled up</span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div style={{ textAlign: 'right', fontSize: '0.85rem' }} className="text-muted">
                      <div>Total Paid by You: <strong>₹{currentUserSummary.totalPaid.toFixed(2)}</strong></div>
                      <div>Your Total Share: <strong>₹{currentUserSummary.totalOwed.toFixed(2)}</strong></div>
                    </div>
                  </div>
                </div>
              )}

              {/* Suggested Repayments (Who Owes Whom) */}
              <div style={{ marginBottom: '2rem' }}>
                <div className="flex-between" style={{ marginBottom: '0.75rem' }}>
                  <div>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 600 }}>Suggested Settlements (Who Owes Whom)</h3>
                    <p className="text-muted" style={{ fontSize: '0.85rem' }}>
                      Minimized repayment transactions calculated by FairShare
                    </p>
                  </div>
                  <span className="badge badge-primary" style={{ fontSize: '0.7rem' }}>
                    <Sparkles size={11} /> Minimized Debts
                  </span>
                </div>

                <SettlementList
                  settlements={balanceData?.suggestedSettlements || []}
                  currentUserId={user?.id}
                  onMarkPaid={(s) => setSettlementToMark(s)}
                />
              </div>

              {/* Group Members Net Balances Grid */}
              <div style={{ marginBottom: '2rem' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '0.75rem' }}>
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
                  <div className="flex-between" style={{ marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <History size={18} color="var(--primary)" />
                      <h3 style={{ fontSize: '1.15rem', fontWeight: 600 }}>Payment & Settlement History</h3>
                    </div>
                    <span className="badge badge-success">
                      {settlementsHistory.length} recorded
                    </span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {settlementsHistory.map((sh) => (
                      <div
                        key={sh.id}
                        className="flex-between"
                        style={{
                          padding: '0.75rem 1rem',
                          background: '#f8fafc',
                          borderRadius: '6px',
                          border: '1px solid var(--border)',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <Check size={16} color="var(--success)" />
                          <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>
                            <strong>{sh.payer_name}</strong> paid <strong>{sh.receiver_name}</strong>
                          </span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                          <span style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--success)' }}>
                            ₹{Number(sh.amount).toFixed(2)}
                          </span>
                          <span className="text-muted" style={{ fontSize: '0.75rem' }}>
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
          <div className="flex-between" style={{ marginBottom: '1.25rem' }}>
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 600 }}>Group Members</h3>
              <p className="text-muted" style={{ fontSize: '0.85rem' }}>
                People sharing expenses in this group
              </p>
            </div>
            <button className="btn btn-secondary" onClick={() => setIsMemberModalOpen(true)} style={{ fontSize: '0.85rem' }}>
              <UserPlus size={14} />
              Invite Friend
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
          <div className="flex-between" style={{ marginBottom: '1.25rem' }}>
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 600 }}>Group Activity Feed</h3>
              <p className="text-muted" style={{ fontSize: '0.85rem' }}>
                Timeline of bills, repayments, and new members
              </p>
            </div>
            <button className="btn btn-secondary" onClick={fetchActivities} disabled={activitiesLoading} style={{ fontSize: '0.85rem' }}>
              <History size={14} className={activitiesLoading ? 'spinner' : ''} />
              Refresh
            </button>
          </div>

          {activitiesLoading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem 0' }}>
              <div className="spinner" style={{ width: '2rem', height: '2rem' }}></div>
            </div>
          ) : activities.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem 1rem', color: 'var(--text-muted)' }}>
              No activity recorded in this group yet.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {activities.map((act) => (
                <div
                  key={act.id}
                  className="flex-between"
                  style={{
                    padding: '0.85rem 1rem',
                    background: '#f8fafc',
                    borderRadius: '8px',
                    border: '1px solid var(--border)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div
                      style={{
                        width: '34px',
                        height: '34px',
                        borderRadius: '50%',
                        backgroundColor:
                          act.type === 'EXPENSE'
                            ? 'var(--primary-light)'
                            : act.type === 'SETTLEMENT'
                            ? 'var(--success-light)'
                            : '#f1f5f9',
                        color:
                          act.type === 'EXPENSE'
                            ? 'var(--primary)'
                            : act.type === 'SETTLEMENT'
                            ? 'var(--success)'
                            : 'var(--text-muted)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      {act.type === 'EXPENSE' ? (
                        <Receipt size={17} />
                      ) : act.type === 'SETTLEMENT' ? (
                        <CheckCircle2 size={17} />
                      ) : (
                        <UserPlus size={17} />
                      )}
                    </div>

                    <div>
                      <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>{act.text}</span>
                      <p className="text-muted" style={{ fontSize: '0.75rem', marginTop: '2px' }}>
                        {new Date(act.timestamp).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                  </div>

                  {act.amount && (
                    <span
                      style={{
                        fontWeight: 700,
                        fontSize: '0.95rem',
                        color: act.type === 'SETTLEMENT' ? 'var(--success)' : 'var(--text-main)',
                      }}
                    >
                      ₹{act.amount.toFixed(2)}
                    </span>
                  )}
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
      />
    </div>
  );
}
