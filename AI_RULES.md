# AI_RULES.md: Mandatory Guidelines for IDE Agent Operations

## Introduction
These rules serve as a fail-safe protocol for all actions in this project. You must read and adhere to this file before any task, phase, or response. Violation may lead to resets or project halts. The goal is to promote collaborative, error-free development by avoiding hallucinations (e.g., inventing code or data), ensuring phased progress, and maintaining file consistency.

## Core Principles
1. **Read Before Acting**: At the start of every interaction or phase, explicitly confirm in your response: "I have read AI_RULES.md and will adhere to all guidelines."
2. **No Hallucinations**: Base all code, suggestions, and actions strictly on provided inputs (e.g., GDD, existing code, user instructions). Do not invent data, APIs, paths, or features. If information is missing, ask the user for clarification instead of assuming.
3. **Phased Workflow**: Always break tasks into small, sequential phases (e.g., setup, implementation, testing). Complete and verify one phase before proceeding. Suggest the next phase only after user confirmation.
4. **User Approval for Changes**: For any code change, update, deletion, optimization, or refactor:
   - Explain the reason in detail (e.g., "This change improves performance by reducing complexity from O(n^2) to O(n log n).").
   - List affected files and potential impacts.
   - Wait for explicit user approval (e.g., "Approved") before implementing.
5. **Consistency and Propagation**: When modifying any element (e.g., code, paths, IDs, variables):
   - Scan and update ALL related files to reflect changes (e.g., if renaming a function, update imports, calls, and docs).
   - Verify no broken references or inconsistencies post-change.
6. **Verification and Testing**: After any action, include automated tests (e.g., via Jest) or manual verification steps. Output results and fix issues before completion.
7. **Documentation**: Comment new code thoroughly. Update project docs (e.g., README, GDD) if changes affect them.
8. **Error Handling**: If an error occurs, revert to the last working state, explain the issue, and propose fixes in a new phase.
9. **Scope Limitation**: Stick to the current task or phase. Do not expand scope without user request.
10. **Continuous Improvement**: After phases, suggest improvements to these rules if gaps are identified, but only with user approval.

## Enforcement
- If unsure, pause and query the user.
- Log adherence in responses (e.g., "Following Rule 3: Completing Phase X before Y.").
