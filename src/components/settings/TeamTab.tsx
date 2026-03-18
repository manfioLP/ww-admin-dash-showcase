"use client";

import { useState } from "react";
import { Plus, X, MoreHorizontal } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type Role = "admin" | "editor" | "viewer";
type Status = "active" | "invited";

type Member = {
  id: string;
  name: string;
  email: string;
  role: Role;
  status: Status;
  initials: string;
  color: string;
};

const INITIAL_MEMBERS: Member[] = [
  { id: "usr_01", name: "Alex Hartman", email: "alex@waniwani.ai", role: "admin", status: "active", initials: "AH", color: "#6C5CE7" },
  { id: "usr_02", name: "Sophie Chen", email: "sophie@waniwani.ai", role: "editor", status: "active", initials: "SC", color: "#10b981" },
  { id: "usr_03", name: "Marcus Wells", email: "marcus@waniwani.ai", role: "viewer", status: "active", initials: "MW", color: "#3b82f6" },
  { id: "usr_04", name: "Priya Nair", email: "priya@partner.com", role: "viewer", status: "invited", initials: "PN", color: "#f59e0b" },
];

const ROLE_CONFIG: Record<Role, { label: string; color: string; bg: string }> = {
  admin: { label: "Admin", color: "#6C5CE7", bg: "#6C5CE718" },
  editor: { label: "Editor", color: "#2563eb", bg: "#3b82f618" },
  viewer: { label: "Viewer", color: "#6b7280", bg: "#9ca3af18" },
};

const inputCls =
  "w-full rounded-lg border border-border bg-white px-3 py-2 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-[#6C5CE7] focus:ring-2 focus:ring-[#6C5CE7]/10 transition-all";

function InviteModal({ onClose, onInvite }: { onClose: () => void; onInvite: (email: string, role: Role) => void }) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<Role>("viewer");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-sm rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <h2 className="text-base font-semibold">Invite Team Member</h2>
          <button onClick={onClose} className="rounded-lg p-1.5 text-muted-foreground hover:bg-gray-100 transition-colors">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="space-y-4 px-6 py-5">
          <div>
            <label className="mb-1.5 block text-sm font-medium">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="colleague@company.com"
              className={inputCls}
              autoFocus
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">Role</label>
            <select value={role} onChange={(e) => setRole(e.target.value as Role)} className={inputCls}>
              <option value="admin">Admin — full access</option>
              <option value="editor">Editor — can configure agents</option>
              <option value="viewer">Viewer — read-only access</option>
            </select>
          </div>
        </div>
        <div className="flex items-center justify-end gap-3 border-t border-border px-6 py-4">
          <button onClick={onClose} className="rounded-lg px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-gray-100 transition-colors">
            Cancel
          </button>
          <button
            onClick={() => { onInvite(email, role); onClose(); }}
            disabled={!email.trim() || !email.includes("@")}
            className="rounded-lg bg-[#6C5CE7] px-4 py-2 text-sm font-medium text-white hover:bg-[#5a4bd1] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Send Invite
          </button>
        </div>
      </div>
    </div>
  );
}

export function TeamTab() {
  const [members, setMembers] = useState(INITIAL_MEMBERS);
  const [showInvite, setShowInvite] = useState(false);

  function handleInvite(email: string, role: Role) {
    const initials = email.slice(0, 2).toUpperCase();
    setMembers((prev) => [
      ...prev,
      {
        id: `usr_${Date.now()}`,
        name: email.split("@")[0],
        email,
        role,
        status: "invited",
        initials,
        color: "#9ca3af",
      },
    ]);
  }

  function handleRemove(id: string) {
    setMembers((prev) => prev.filter((m) => m.id !== id));
  }

  return (
    <div className="max-w-3xl">
      <Card className="border-border/50">
        <CardContent className="p-0">
          <div className="flex items-center justify-between border-b border-border px-6 py-5">
            <div>
              <h3 className="text-sm font-semibold">Team Members</h3>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {members.length} member{members.length !== 1 ? "s" : ""} · Manage roles and access
              </p>
            </div>
            <button
              onClick={() => setShowInvite(true)}
              className="inline-flex items-center gap-2 rounded-lg bg-[#6C5CE7] px-3.5 py-2 text-sm font-medium text-white hover:bg-[#5a4bd1] transition-colors"
            >
              <Plus className="h-3.5 w-3.5" />
              Invite Member
            </button>
          </div>

          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-border bg-gray-50/60">
                {["Member", "Role", "Status", "Joined", ""].map((h) => (
                  <th key={h} className="px-5 py-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {members.map((m, i) => {
                const role = ROLE_CONFIG[m.role];
                return (
                  <tr
                    key={m.id}
                    className={cn(
                      "transition-colors hover:bg-gray-50/50",
                      i < members.length - 1 && "border-b border-border/50"
                    )}
                  >
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div
                          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold text-white"
                          style={{ backgroundColor: m.color }}
                        >
                          {m.initials}
                        </div>
                        <div>
                          <p className="text-sm font-medium">{m.name}</p>
                          <p className="text-xs text-muted-foreground">{m.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <span
                        className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium"
                        style={{ color: role.color, backgroundColor: role.bg }}
                      >
                        {role.label}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span
                        className={cn(
                          "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium",
                          m.status === "active"
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-amber-50 text-amber-700"
                        )}
                      >
                        <span
                          className={cn(
                            "h-1.5 w-1.5 rounded-full",
                            m.status === "active" ? "bg-emerald-500" : "bg-amber-500"
                          )}
                        />
                        {m.status === "active" ? "Active" : "Invited"}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-sm text-muted-foreground">
                      {m.status === "active" ? "—" : "Pending"}
                    </td>
                    <td className="px-5 py-3.5">
                      {m.role !== "admin" && (
                        <button
                          onClick={() => handleRemove(m.id)}
                          className="rounded-lg p-1.5 text-muted-foreground hover:bg-red-50 hover:text-red-600 transition-colors"
                          title="Remove member"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {showInvite && (
        <InviteModal onClose={() => setShowInvite(false)} onInvite={handleInvite} />
      )}
    </div>
  );
}
