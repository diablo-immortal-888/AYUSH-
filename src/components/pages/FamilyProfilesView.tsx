import React, { useState } from 'react';
import {
  Users,
  Plus,
  CheckCircle2,
  Heart,
  User,
  Calendar,
  ShieldCheck,
  X
} from 'lucide-react';
import { useHealth } from '../../context/HealthContext';

export const FamilyProfilesView: React.FC = () => {
  const { familyMembers, activeMember, setActiveMember, addFamilyMember } = useHealth();

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [name, setName] = useState('');
  const [relation, setRelation] = useState('Child');
  const [bloodGroup, setBloodGroup] = useState('B+');
  const [dob, setDob] = useState('2015-06-20');
  const [abhaId, setAbhaId] = useState('');
  const [allergiesInput, setAllergiesInput] = useState('');
  const [conditionsInput, setConditionsInput] = useState('');

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    await addFamilyMember({
      name: name.trim(),
      relation,
      bloodGroup,
      dob,
      abhaId: abhaId.trim() || undefined,
      allergies: allergiesInput ? allergiesInput.split(',').map(s => s.trim()) : [],
      conditions: conditionsInput ? conditionsInput.split(',').map(s => s.trim()) : []
    });

    setName('');
    setAllergiesInput('');
    setConditionsInput('');
    setIsAddOpen(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 select-none">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-slate-900">
            Family Health Profiles
          </h2>
          <p className="text-xs text-purple-600/70">
            Manage isolated health records for each member of your household under one secure account.
          </p>
        </div>

        <button
          onClick={() => setIsAddOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold shadow-md shadow-purple-500/20 transition"
        >
          <Plus className="w-4 h-4" />
          <span>Add Family Member</span>
        </button>
      </div>

      {/* Profiles Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {familyMembers.map((fm) => {
          const isSelected = activeMember === fm.relation;

          return (
            <div
              key={fm.id}
              className={`p-5 rounded-3xl border transition-all flex flex-col justify-between ${
                isSelected
                  ? 'bg-white border-purple-400 shadow-md shadow-purple-500/10 ring-2 ring-purple-400/30'
                  : 'bg-white border-purple-100 hover:border-purple-200'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-2xl bg-purple-100 text-purple-800 font-black text-base flex items-center justify-center">
                    {fm.name.charAt(0)}
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-purple-50 text-purple-700">
                    {fm.relation}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 mb-0.5">
                  {fm.name}
                </h3>
                <p className="text-xs text-purple-500 font-medium mb-3">
                  Blood Group: <strong>{fm.bloodGroup}</strong> • DOB: {fm.dob}
                </p>

                {fm.conditions && fm.conditions.length > 0 && (
                  <div className="mb-2">
                    <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider block mb-1">
                      Conditions:
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {fm.conditions.map((c, i) => (
                        <span key={i} className="text-[10px] px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 font-semibold">
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-purple-50 mt-4">
                {isSelected ? (
                  <div className="flex items-center justify-center gap-1.5 py-1.5 rounded-xl bg-purple-100 text-purple-800 text-xs font-bold">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Currently Active</span>
                  </div>
                ) : (
                  <button
                    onClick={() => setActiveMember(fm.relation)}
                    className="w-full py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-800 text-xs font-bold transition"
                  >
                    Switch to {fm.name}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Member Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-purple-950/30 backdrop-blur-xs">
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-purple-100 p-6 sm:p-8">
            <button
              onClick={() => setIsAddOpen(false)}
              className="absolute top-5 right-5 p-1 text-purple-400 hover:text-purple-700 rounded-full transition"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-base font-bold text-slate-900 mb-1">
              Add New Family Health Profile
            </h3>
            <p className="text-xs text-purple-500/80 mb-5">
              Keep separate diagnostic histories and records.
            </p>

            <form onSubmit={handleAddMember} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Aarav Kashyap"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 bg-purple-50/40 border border-purple-200 rounded-xl text-slate-900 outline-none focus:border-purple-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Relationship</label>
                  <select
                    value={relation}
                    onChange={(e) => setRelation(e.target.value)}
                    className="w-full px-2.5 py-2 bg-purple-50/40 border border-purple-200 rounded-xl font-semibold text-purple-900 outline-none"
                  >
                    <option value="Self">Self</option>
                    <option value="Mother">Mother</option>
                    <option value="Father">Father</option>
                    <option value="Child">Child</option>
                    <option value="Spouse">Spouse</option>
                    <option value="Sibling">Sibling</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Blood Group</label>
                  <select
                    value={bloodGroup}
                    onChange={(e) => setBloodGroup(e.target.value)}
                    className="w-full px-2.5 py-2 bg-purple-50/40 border border-purple-200 rounded-xl font-semibold text-purple-900 outline-none"
                  >
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Date of Birth</label>
                <input
                  type="date"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  className="w-full px-3 py-2 bg-purple-50/40 border border-purple-200 rounded-xl text-slate-900 outline-none font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Allergies (comma separated)</label>
                <input
                  type="text"
                  placeholder="e.g. Dust, Sulfa drugs"
                  value={allergiesInput}
                  onChange={(e) => setAllergiesInput(e.target.value)}
                  className="w-full px-3 py-2 bg-purple-50/40 border border-purple-200 rounded-xl text-slate-900 outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Known Diagnoses (comma separated)</label>
                <input
                  type="text"
                  placeholder="e.g. Asthma, Hypertension"
                  value={conditionsInput}
                  onChange={(e) => setConditionsInput(e.target.value)}
                  className="w-full px-3 py-2 bg-purple-50/40 border border-purple-200 rounded-xl text-slate-900 outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold shadow-md shadow-purple-500/20 transition mt-2"
              >
                Create Health Profile
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
