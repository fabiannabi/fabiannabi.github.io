window.FORGE_DATA = {
 "static": true,
 "orchestrations": [
  {
   "id": "ciencia-lab",
   "name": "Ciencia Lab",
   "tagline": "A science animation studio that takes a viral topic all the way to a fact-checked, mixed video.",
   "domain": "Science communication · Vertical video",
   "lead": "ceo",
   "color": "#0ca678",
   "experts": [
    {
     "id": "ceo",
     "name": "CEO",
     "role": "orchestrator",
     "summary": "Plans episodes, assigns the work and delivers the video ready to publish.",
     "skill": "ciencia-ceo",
     "instructions": "",
     "model": "claude-opus-5-5",
     "model_reason": "Plans, delegates and makes judgment calls — gets the strongest reasoning.",
     "capabilities": [
      "read",
      "write"
     ]
    },
    {
     "id": "investigador",
     "name": "Researcher",
     "role": "specialist",
     "summary": "Picks topics with viral potential and builds the brief from primary sources.",
     "skill": "ciencia-investigador",
     "instructions": "",
     "model": "claude-sonnet-5-5",
     "model_reason": "Fast, capable model for focused production work.",
     "capabilities": [
      "read",
      "write",
      "web"
     ]
    },
    {
     "id": "guionista",
     "name": "Scriptwriter",
     "role": "specialist",
     "summary": "Beat-by-beat 61–90 s script with narration, on-screen text, visuals and sound.",
     "skill": "ciencia-guionista",
     "instructions": "",
     "model": "claude-sonnet-5-5",
     "model_reason": "Fast, capable model for focused production work.",
     "capabilities": [
      "read",
      "write"
     ]
    },
    {
     "id": "factcheck",
     "name": "Fact-checker",
     "role": "reviewer",
     "summary": "Verifies every claim and formula against primary sources before spending on voice or render.",
     "skill": "ciencia-factcheck",
     "instructions": "",
     "model": "claude-opus-5-5",
     "model_reason": "Last check before a human sees the work — catches subtle mistakes.",
     "capabilities": [
      "read",
      "web"
     ]
    },
    {
     "id": "voz",
     "name": "Voice Director",
     "role": "specialist",
     "summary": "Generates the narration and the timeline that syncs the animation.",
     "skill": "ciencia-voz",
     "instructions": "",
     "model": "claude-sonnet-5-5",
     "model_reason": "Fast, capable model for focused production work.",
     "capabilities": [
      "read",
      "write",
      "shell"
     ]
    },
    {
     "id": "animador",
     "name": "Animator",
     "role": "specialist",
     "summary": "1080x1920 Manim scene synced to the voice, with real molecules.",
     "skill": "ciencia-animador",
     "instructions": "",
     "model": "claude-sonnet-5-5",
     "model_reason": "Fast, capable model for focused production work.",
     "capabilities": [
      "read",
      "write",
      "shell"
     ]
    },
    {
     "id": "musico",
     "name": "Composer",
     "role": "specialist",
     "summary": "Original code-generated music that follows the mood of each beat.",
     "skill": "ciencia-musico",
     "instructions": "",
     "model": "claude-sonnet-5-5",
     "model_reason": "Fast, capable model for focused production work.",
     "capabilities": [
      "read",
      "write",
      "shell"
     ]
    },
    {
     "id": "sonido",
     "name": "Sound Designer",
     "role": "specialist",
     "summary": "Sound effects, ambience and final mix with ducking at -14 LUFS.",
     "skill": "ciencia-sonido",
     "instructions": "",
     "model": "claude-sonnet-5-5",
     "model_reason": "Fast, capable model for focused production work.",
     "capabilities": [
      "read",
      "write",
      "shell"
     ]
    },
    {
     "id": "qa",
     "name": "QA",
     "role": "reviewer",
     "summary": "Automated technical checks (specs, loudness, duration, frames) plus a content review.",
     "skill": "ciencia-qa",
     "instructions": "",
     "model": "claude-opus-5-5",
     "model_reason": "Last check before a human sees the work — catches subtle mistakes.",
     "capabilities": [
      "read",
      "shell"
     ]
    },
    {
     "id": "publicador",
     "name": "Publisher",
     "role": "specialist",
     "summary": "Per-platform captions with sources and hashtags; uploads only with approval.",
     "skill": "ciencia-publicador",
     "instructions": "",
     "model": "claude-sonnet-5-5",
     "model_reason": "Fast, capable model for focused production work.",
     "capabilities": [
      "read",
      "write"
     ]
    },
    {
     "id": "analista",
     "name": "Analyst",
     "role": "specialist",
     "summary": "Reads retention, shares and follower growth; decides which topics and hooks to repeat.",
     "skill": "ciencia-analista",
     "instructions": "",
     "model": "claude-sonnet-5-5",
     "model_reason": "Fast, capable model for focused production work.",
     "capabilities": [
      "read",
      "write",
      "web"
     ]
    }
   ],
   "flow": [
    {
     "id": "plan",
     "label": "Plan the episode",
     "expert": "ceo",
     "after": [],
     "gate": null,
     "task": "",
     "action": null,
     "params": {},
     "edits": false,
     "hooks": {},
     "retry": 0,
     "reviews": null,
     "rounds": 0
    },
    {
     "id": "brief",
     "label": "Sourced brief",
     "expert": "investigador",
     "after": [
      "plan"
     ],
     "gate": null,
     "task": "",
     "action": null,
     "params": {},
     "edits": false,
     "hooks": {},
     "retry": 0,
     "reviews": null,
     "rounds": 0
    },
    {
     "id": "guion",
     "label": "Beat-by-beat script",
     "expert": "guionista",
     "after": [
      "brief"
     ],
     "gate": null,
     "task": "",
     "action": null,
     "params": {},
     "edits": false,
     "hooks": {},
     "retry": 0,
     "reviews": null,
     "rounds": 0
    },
    {
     "id": "verificar",
     "label": "Fact-check",
     "expert": "factcheck",
     "after": [
      "guion"
     ],
     "gate": null,
     "task": "",
     "action": null,
     "params": {},
     "edits": false,
     "hooks": {},
     "retry": 0,
     "reviews": null,
     "rounds": 0
    },
    {
     "id": "ok_guion",
     "label": "Approve the script",
     "expert": null,
     "after": [
      "verificar"
     ],
     "gate": "human",
     "task": "",
     "action": null,
     "params": {},
     "edits": false,
     "hooks": {},
     "retry": 0,
     "reviews": null,
     "rounds": 0
    },
    {
     "id": "narrar",
     "label": "Narration & timeline",
     "expert": "voz",
     "after": [
      "ok_guion"
     ],
     "gate": null,
     "task": "",
     "action": null,
     "params": {},
     "edits": false,
     "hooks": {},
     "retry": 0,
     "reviews": null,
     "rounds": 0
    },
    {
     "id": "animar",
     "label": "Manim animation",
     "expert": "animador",
     "after": [
      "narrar"
     ],
     "gate": null,
     "task": "",
     "action": null,
     "params": {},
     "edits": false,
     "hooks": {},
     "retry": 0,
     "reviews": null,
     "rounds": 0
    },
    {
     "id": "musica",
     "label": "Original score",
     "expert": "musico",
     "after": [
      "narrar"
     ],
     "gate": null,
     "task": "",
     "action": null,
     "params": {},
     "edits": false,
     "hooks": {},
     "retry": 0,
     "reviews": null,
     "rounds": 0
    },
    {
     "id": "mezclar",
     "label": "Sound effects & mix",
     "expert": "sonido",
     "after": [
      "animar",
      "musica"
     ],
     "gate": null,
     "task": "",
     "action": null,
     "params": {},
     "edits": false,
     "hooks": {},
     "retry": 0,
     "reviews": null,
     "rounds": 0
    },
    {
     "id": "qa",
     "label": "Technical & content QA",
     "expert": "qa",
     "after": [
      "mezclar"
     ],
     "gate": null,
     "task": "",
     "action": null,
     "params": {},
     "edits": false,
     "hooks": {},
     "retry": 0,
     "reviews": null,
     "rounds": 0
    },
    {
     "id": "ok_video",
     "label": "Approve the final video",
     "expert": null,
     "after": [
      "qa"
     ],
     "gate": "human",
     "task": "",
     "action": null,
     "params": {},
     "edits": false,
     "hooks": {},
     "retry": 0,
     "reviews": null,
     "rounds": 0
    },
    {
     "id": "publicar",
     "label": "Publish to platforms",
     "expert": "publicador",
     "after": [
      "ok_video"
     ],
     "gate": null,
     "task": "",
     "action": null,
     "params": {},
     "edits": false,
     "hooks": {},
     "retry": 0,
     "reviews": null,
     "rounds": 0
    },
    {
     "id": "reporte",
     "label": "Weekly report",
     "expert": "analista",
     "after": [],
     "gate": null,
     "task": "",
     "action": null,
     "params": {},
     "edits": false,
     "hooks": {},
     "retry": 0,
     "reviews": null,
     "rounds": 0
    }
   ],
   "levels": [
    [
     "plan",
     "reporte"
    ],
    [
     "brief"
    ],
    [
     "guion"
    ],
    [
     "verificar"
    ],
    [
     "ok_guion"
    ],
    [
     "narrar"
    ],
    [
     "animar",
     "musica"
    ],
    [
     "mezclar"
    ],
    [
     "qa"
    ],
    [
     "ok_video"
    ],
    [
     "publicar"
    ]
   ],
   "triggers": [
    {
     "id": "episodio",
     "type": "manual",
     "name": "New episode",
     "schedule": null,
     "source": null,
     "event": null,
     "start": null,
     "only": [
      "plan",
      "brief",
      "guion",
      "verificar",
      "ok_guion",
      "narrar",
      "animar",
      "musica",
      "mezclar",
      "qa",
      "ok_video",
      "publicar"
     ]
    },
    {
     "id": "semanal",
     "type": "cron",
     "name": "Monday report",
     "schedule": "0 9 * * 1",
     "source": null,
     "event": null,
     "start": null,
     "only": [
      "reporte"
     ]
    }
   ],
   "guardrails": [
    "No claim reaches voice or render without a fact-check against primary sources.",
    "Safe health language; no medical advice.",
    "Only original music and sound effects, no third-party rights.",
    "Nothing is uploaded without human approval."
   ],
   "links": [
    {
     "label": "@neon.molecules",
     "url": "https://www.instagram.com/neon.molecules/"
    }
   ],
   "environment": {
    "type": "Git worktree per episode",
    "repo": "episode workspace (private)",
    "runtime": "Python · Manim · ffmpeg",
    "isolation": "Each episode renders in its own folder; voice, animation and music run in parallel.",
    "secrets": "Voice API key stays in the OS — never in the repo or in prompts."
   },
   "integrations": [
    {
     "id": "elevenlabs",
     "kind": "mcp",
     "server": "elevenlabs",
     "name": "ElevenLabs",
     "used_by": [
      "voz",
      "musico",
      "sonido"
     ],
     "purpose": "Narration with word-level timings, the music score and the sound-effects bank."
    },
    {
     "id": "pubchem",
     "kind": "api",
     "name": "PubChem",
     "used_by": [
      "factcheck",
      "animador"
     ],
     "purpose": "Real molecular structures and formulas, checked before render."
    },
    {
     "id": "manim",
     "kind": "cli",
     "name": "Manim",
     "used_by": [
      "animador"
     ],
     "purpose": "Renders the 1080x1920 science animation from code."
    },
    {
     "id": "ffmpeg",
     "kind": "cli",
     "name": "ffmpeg",
     "used_by": [
      "sonido",
      "qa"
     ],
     "purpose": "Mixing, loudness checks and final encode."
    },
    {
     "id": "chrome",
     "kind": "mcp",
     "server": "claude-in-chrome",
     "name": "Claude in Chrome",
     "used_by": [
      "publicador",
      "analista"
     ],
     "purpose": "Uploads to the platforms and reads retention metrics."
    },
    {
     "id": "instagram",
     "kind": "browser",
     "name": "Instagram Reels",
     "used_by": [
      "publicador",
      "analista"
     ],
     "purpose": "Publishes on @neon.molecules and reads views, shares and follows."
    },
    {
     "id": "youtube",
     "kind": "browser",
     "name": "YouTube Shorts",
     "used_by": [
      "publicador",
      "analista"
     ],
     "purpose": "Publishes Shorts and reads retention."
    }
   ],
   "context": [
    {
     "kind": "skill",
     "name": "Skill instructions",
     "detail": "Each Expert's role, steps and checklists."
    },
    {
     "kind": "memory",
     "name": "Team memory",
     "detail": "Which topics, hooks and formats performed."
    },
    {
     "kind": "corrections",
     "name": "Corrections",
     "detail": "Rules learned when a human requested changes."
    },
    {
     "kind": "flow",
     "name": "Upstream outputs",
     "detail": "Brief → script → voice timeline → scene."
    },
    {
     "kind": "doc",
     "name": "Sourced brief",
     "detail": "Primary sources for every claim in the script."
    },
    {
     "kind": "data",
     "name": "Voice timeline",
     "detail": "Word timings from the narration, used to sync every beat."
    }
   ],
   "corrections": [
    "Every formula is checked against PubChem before anything is rendered.",
    "Health claims use safe language — never medical advice.",
    "Music ducks under the narration; the final mix sits at -14 LUFS.",
    "The hook has to land in the first second."
   ],
   "on_failure": [],
   "memory": "- 2026-11-07 16:35 · Researcher: in \"Sourced brief\", validate the input before starting.\n- 2026-11-07 16:35 · Fact-checker: in \"Fact-check\", validate the input before starting.\n- 2026-11-07 16:35 · Session 24bd10d487 completed (semanal) with 1 steps.\n",
   "expert_stats": {
    "analista": {
     "expert": "analista",
     "steps": 1,
     "avg_s": 26.4,
     "cost": 0.1902
    },
    "animador": {
     "expert": "animador",
     "steps": 1,
     "avg_s": 42.9,
     "cost": 0.3252
    },
    "ceo": {
     "expert": "ceo",
     "steps": 1,
     "avg_s": 29.7,
     "cost": 0.0589
    },
    "factcheck": {
     "expert": "factcheck",
     "steps": 1,
     "avg_s": 119.6,
     "cost": 0.1551
    },
    "guionista": {
     "expert": "guionista",
     "steps": 1,
     "avg_s": 175.9,
     "cost": 0.3352
    },
    "investigador": {
     "expert": "investigador",
     "steps": 1,
     "avg_s": 95.5,
     "cost": 0.0401
    },
    "musico": {
     "expert": "musico",
     "steps": 1,
     "avg_s": 43.3,
     "cost": 0.2306
    },
    "qa": {
     "expert": "qa",
     "steps": 1,
     "avg_s": 32.8,
     "cost": 0.0794
    },
    "sonido": {
     "expert": "sonido",
     "steps": 1,
     "avg_s": 214.4,
     "cost": 0.2818
    },
    "voz": {
     "expert": "voz",
     "steps": 1,
     "avg_s": 79.5,
     "cost": 0.2841
    },
    "_gates": {
     "awaiting_approval": 1,
     "done": 1
    }
   }
  },
  {
   "id": "dev-loop",
   "name": "Dev Loop",
   "tagline": "Turns a planning note into an issue, a branch, a reviewed pull request and a human decision.",
   "domain": "Software delivery",
   "lead": "advisor",
   "color": "#2f9e44",
   "experts": [
    {
     "id": "advisor",
     "name": "Advisor",
     "role": "orchestrator",
     "summary": "Turns a rough note into an issue someone can build — the problem, acceptance criteria, likely files and how to test it.",
     "skill": null,
     "instructions": "Write the GitHub issue body for this ticket. Sections: Problem, Acceptance criteria (checkable bullets), Likely files, How to test. Do not write code. Do not invent requirements the note does not imply; list open questions instead.\n",
     "model": "claude-opus-5-5",
     "model_reason": "Plans, delegates and makes judgment calls — gets the strongest reasoning.",
     "capabilities": [
      "read"
     ]
    },
    {
     "id": "implementer",
     "name": "Implementer",
     "role": "specialist",
     "summary": "Makes the change on the ticket's branch inside a throwaway container, until the repo's own checks pass.",
     "skill": null,
     "instructions": "Implement the issue in the current repository. Follow its CLAUDE.md. Keep the change as small as the acceptance criteria allow, add or update tests, and stop when `npm run verify` passes. Never push, never touch main, never merge.\n",
     "model": "claude-sonnet-5-5",
     "model_reason": "Fast, capable model for focused production work.",
     "capabilities": [
      "read",
      "write",
      "shell"
     ]
    },
    {
     "id": "reviewer",
     "name": "Reviewer",
     "role": "reviewer",
     "summary": "Reviews the pull request against the issue and the repo's rules before a human sees it.",
     "skill": null,
     "instructions": "Review the diff against the issue's acceptance criteria and the repo's CLAUDE.md. Start your answer with \"VERDICT: approve\" or \"VERDICT: changes\", then one bullet per finding with the file and what to change. Approve only what you would merge yourself.\n",
     "model": "claude-opus-5-5",
     "model_reason": "Last check before a human sees the work — catches subtle mistakes.",
     "capabilities": [
      "read"
     ]
    }
   ],
   "flow": [
    {
     "id": "spec",
     "label": "Draft the issue",
     "expert": "advisor",
     "after": [],
     "gate": null,
     "task": "",
     "action": null,
     "params": {},
     "edits": false,
     "hooks": {},
     "retry": 0,
     "reviews": null,
     "rounds": 0
    },
    {
     "id": "open_issue",
     "label": "Open the issue",
     "expert": null,
     "after": [
      "spec"
     ],
     "gate": null,
     "task": "",
     "action": "github.create_issue",
     "params": {
      "title": "{title}",
      "body": "{output.spec}\n\n---\n*Drafted by Forge's Advisor from the note `{slug}`. Add the `forge:build` label to start the work.*",
      "labels": [
       "forge:spec"
      ]
     },
     "edits": false,
     "hooks": {},
     "retry": 0,
     "reviews": null,
     "rounds": 0
    },
    {
     "id": "note_spec",
     "label": "Link the note to the issue",
     "expert": null,
     "after": [
      "open_issue"
     ],
     "gate": null,
     "task": "",
     "action": "vault.update",
     "params": {
      "status": "spec",
      "issue": "{issue}"
     },
     "edits": false,
     "hooks": {},
     "retry": 0,
     "reviews": null,
     "rounds": 0
    },
    {
     "id": "workspace",
     "label": "Create the workspace",
     "expert": null,
     "after": [
      "note_spec"
     ],
     "gate": null,
     "task": "",
     "action": "workspace.create",
     "params": {},
     "edits": false,
     "hooks": {},
     "retry": 0,
     "reviews": null,
     "rounds": 0
    },
    {
     "id": "note_building",
     "label": "Mark the note as building",
     "expert": null,
     "after": [
      "workspace"
     ],
     "gate": null,
     "task": "",
     "action": "vault.update",
     "params": {
      "status": "building"
     },
     "edits": false,
     "hooks": {},
     "retry": 0,
     "reviews": null,
     "rounds": 0
    },
    {
     "id": "implement",
     "label": "Implement the issue",
     "expert": "implementer",
     "after": [
      "note_building"
     ],
     "gate": null,
     "task": "",
     "action": null,
     "params": {},
     "edits": true,
     "hooks": {
      "after": [
       "npm run verify"
      ]
     },
     "retry": 2,
     "reviews": null,
     "rounds": 0
    },
    {
     "id": "push",
     "label": "Push the branch",
     "expert": null,
     "after": [
      "implement"
     ],
     "gate": null,
     "task": "",
     "action": "workspace.push",
     "params": {
      "message": "{title}\n\nCloses #{issue}. Written by Forge's dev-loop."
     },
     "edits": false,
     "hooks": {},
     "retry": 0,
     "reviews": null,
     "rounds": 0
    },
    {
     "id": "open_pr",
     "label": "Open the pull request",
     "expert": null,
     "after": [
      "push"
     ],
     "gate": null,
     "task": "",
     "action": "github.open_pr",
     "params": {
      "title": "{title}",
      "body": "Closes #{issue}\n\n{output.implement}\n\n---\n*Opened by Forge's dev-loop. A reviewer agent comments next; a human decides.*"
     },
     "edits": false,
     "hooks": {},
     "retry": 0,
     "reviews": null,
     "rounds": 0
    },
    {
     "id": "review",
     "label": "Review the pull request",
     "expert": "reviewer",
     "after": [
      "open_pr"
     ],
     "gate": null,
     "task": "",
     "action": null,
     "params": {},
     "edits": false,
     "hooks": {},
     "retry": 0,
     "reviews": "implement",
     "rounds": 2
    },
    {
     "id": "comment_review",
     "label": "Post the review",
     "expert": null,
     "after": [
      "review"
     ],
     "gate": null,
     "task": "",
     "action": "github.comment",
     "params": {
      "target": "pr",
      "body": "**Forge reviewer** · {review_verdict} after {review_rounds} round(s)\n\n{output.review}"
     },
     "edits": false,
     "hooks": {},
     "retry": 0,
     "reviews": null,
     "rounds": 0
    },
    {
     "id": "ready_for_human",
     "label": "Ask for a human review",
     "expert": null,
     "after": [
      "comment_review"
     ],
     "gate": null,
     "task": "",
     "action": "github.label",
     "params": {
      "target": "pr",
      "add": [
       "forge:human-review"
      ]
     },
     "edits": false,
     "hooks": {},
     "retry": 0,
     "reviews": null,
     "rounds": 0
    },
    {
     "id": "note_review",
     "label": "Mark the note as in review",
     "expert": null,
     "after": [
      "ready_for_human"
     ],
     "gate": null,
     "task": "",
     "action": "vault.update",
     "params": {
      "status": "review",
      "pr": "{pr}"
     },
     "edits": false,
     "hooks": {},
     "retry": 0,
     "reviews": null,
     "rounds": 0
    },
    {
     "id": "human_review",
     "label": "Human review and merge",
     "expert": null,
     "after": [
      "note_review"
     ],
     "gate": "human",
     "task": "",
     "action": null,
     "params": {},
     "edits": false,
     "hooks": {},
     "retry": 0,
     "reviews": null,
     "rounds": 0
    },
    {
     "id": "note_done",
     "label": "Close the note",
     "expert": null,
     "after": [
      "human_review"
     ],
     "gate": null,
     "task": "",
     "action": "vault.update",
     "params": {
      "status": "done"
     },
     "edits": false,
     "hooks": {},
     "retry": 0,
     "reviews": null,
     "rounds": 0
    },
    {
     "id": "cleanup",
     "label": "Remove the workspace",
     "expert": null,
     "after": [
      "note_done"
     ],
     "gate": null,
     "task": "",
     "action": "workspace.remove",
     "params": {},
     "edits": false,
     "hooks": {},
     "retry": 0,
     "reviews": null,
     "rounds": 0
    }
   ],
   "levels": [
    [
     "spec"
    ],
    [
     "open_issue"
    ],
    [
     "note_spec"
    ],
    [
     "workspace"
    ],
    [
     "note_building"
    ],
    [
     "implement"
    ],
    [
     "push"
    ],
    [
     "open_pr"
    ],
    [
     "review"
    ],
    [
     "comment_review"
    ],
    [
     "ready_for_human"
    ],
    [
     "note_review"
    ],
    [
     "human_review"
    ],
    [
     "note_done"
    ],
    [
     "cleanup"
    ]
   ],
   "triggers": [
    {
     "id": "spec",
     "type": "manual",
     "name": "Note marked ready",
     "schedule": null,
     "source": null,
     "event": null,
     "start": null,
     "only": [
      "spec",
      "open_issue",
      "note_spec"
     ]
    },
    {
     "id": "build",
     "type": "event",
     "name": "Issue labelled forge:build",
     "schedule": null,
     "source": "github",
     "event": "issues.labeled",
     "start": "workspace",
     "only": []
    }
   ],
   "guardrails": [
    "Forge never merges and never pushes to the default branch; a human decides every pull request.",
    "Only repos listed in dev_loop.repos can be written to.",
    "Code runs in a throwaway container with no network and none of this machine's credentials.",
    "Every ticket has a spending limit; going over it stops the work and marks the ticket blocked."
   ],
   "links": [],
   "environment": {
    "type": "Docker container per ticket",
    "runtime": "node:22-alpine, no network, 2 CPUs / 2 GB, all capabilities dropped",
    "isolation": "One git worktree and branch per issue; git and GitHub calls stay on the host",
    "secrets": "The GitHub token lives with gh on the host and never enters the container"
   },
   "integrations": [
    {
     "id": "github",
     "name": "GitHub",
     "kind": "cli",
     "used_by": [
      "advisor",
      "reviewer"
     ],
     "purpose": "Issues, labels, branches, pull requests and review comments, through gh, limited to an allowlist of repos."
    },
    {
     "id": "obsidian",
     "name": "Obsidian vault",
     "kind": "manual",
     "used_by": [
      "advisor"
     ],
     "purpose": "Planning notes with a status in their front matter; Forge reads ready notes and writes back issue, PR and status."
    },
    {
     "id": "docker",
     "name": "Docker",
     "kind": "cli",
     "used_by": [
      "implementer"
     ],
     "purpose": "One throwaway container per hook, with the worktree mounted and no network."
    }
   ],
   "context": [
    {
     "name": "The ticket note",
     "kind": "data",
     "detail": "Title, body, labels and budget from the Obsidian front matter."
    },
    {
     "name": "The repo's CLAUDE.md",
     "kind": "docs",
     "detail": "House rules the Implementer and the Reviewer follow."
    },
    {
     "name": "Failed checks",
     "kind": "feedback",
     "detail": "Output of a failing after-hook, sent back to the Implementer on retry."
    },
    {
     "name": "Review notes",
     "kind": "feedback",
     "detail": "The Reviewer's findings, sent back to the Implementer when it asks for changes."
    }
   ],
   "corrections": [],
   "on_failure": [
    {
     "action": "github.label",
     "params": {
      "add": [
       "forge:blocked"
      ]
     }
    },
    {
     "action": "github.comment",
     "params": {
      "body": "**Forge stopped:** {error}\n\nRemove `forge:blocked` and keep `forge:build` to try again."
     }
    },
    {
     "action": "vault.update",
     "params": {
      "status": "blocked"
     }
    }
   ],
   "memory": "- 2026-11-08 15:02 · Session 72228888dd completed (spec) with 3 steps.\n- 2026-11-08 15:20 · Session e53ac28c8f completed (build) with 12 steps.\n",
   "expert_stats": {
    "advisor": {
     "expert": "advisor",
     "steps": 1,
     "avg_s": 184.4,
     "cost": 0.1049
    },
    "implementer": {
     "expert": "implementer",
     "steps": 1,
     "avg_s": 84.0,
     "cost": 0.06
    },
    "reviewer": {
     "expert": "reviewer",
     "steps": 1,
     "avg_s": 15.0,
     "cost": 0.02
    },
    "_gates": {
     "done": 12
    }
   }
  },
  {
   "id": "elitro-lab",
   "name": "Élitro Lab",
   "tagline": "A game design lab that improves a trading card game with real biology, simulations and playtests.",
   "domain": "Game design · Simulation",
   "lead": "director",
   "color": "#7048e8",
   "experts": [
    {
     "id": "director",
     "name": "Director",
     "role": "orchestrator",
     "summary": "Runs the full improvement cycle and assigns work across the experts.",
     "skill": "elitro-director",
     "instructions": "",
     "model": "claude-opus-5-5",
     "model_reason": "Plans, delegates and makes judgment calls — gets the strongest reasoning.",
     "capabilities": [
      "read",
      "write",
      "shell"
     ]
    },
    {
     "id": "biologo",
     "name": "Biologist",
     "role": "specialist",
     "summary": "Researches how real insects and arachnids behave and turns it into mechanics.",
     "skill": "elitro-biologo",
     "instructions": "",
     "model": "claude-sonnet-5-5",
     "model_reason": "Fast, capable model for focused production work.",
     "capabilities": [
      "read",
      "write",
      "web"
     ]
    },
    {
     "id": "investigador",
     "name": "Design Researcher",
     "role": "specialist",
     "summary": "Studies how other games solve the problem, with sources, without copying them.",
     "skill": "elitro-investigador",
     "instructions": "",
     "model": "claude-sonnet-5-5",
     "model_reason": "Fast, capable model for focused production work.",
     "capabilities": [
      "read",
      "write",
      "web"
     ]
    },
    {
     "id": "recursos",
     "name": "Economy Analyst",
     "role": "specialist",
     "summary": "Analyzes the resource economy and whether every turn offers real decisions.",
     "skill": "elitro-recursos",
     "instructions": "",
     "model": "claude-sonnet-5-5",
     "model_reason": "Fast, capable model for focused production work.",
     "capabilities": [
      "read",
      "write",
      "shell"
     ]
    },
    {
     "id": "tablero",
     "name": "Board Designer",
     "role": "specialist",
     "summary": "Studies the play space and proposes measured variants.",
     "skill": "elitro-tablero",
     "instructions": "",
     "model": "claude-sonnet-5-5",
     "model_reason": "Fast, capable model for focused production work.",
     "capabilities": [
      "read",
      "write",
      "shell"
     ]
    },
    {
     "id": "cartas",
     "name": "Card Designer",
     "role": "specialist",
     "summary": "Creates and tunes cards with a power budget and a clear faction identity.",
     "skill": "elitro-disenador-cartas",
     "instructions": "",
     "model": "claude-sonnet-5-5",
     "model_reason": "Fast, capable model for focused production work.",
     "capabilities": [
      "read",
      "write"
     ]
    },
    {
     "id": "balance",
     "name": "Balance",
     "role": "reviewer",
     "summary": "AI-vs-AI simulations; tunes one variable at a time until thresholds are met.",
     "skill": "elitro-balance",
     "instructions": "",
     "model": "claude-opus-5-5",
     "model_reason": "Last check before a human sees the work — catches subtle mistakes.",
     "capabilities": [
      "read",
      "write",
      "shell"
     ]
    },
    {
     "id": "playtest",
     "name": "Playtester",
     "role": "reviewer",
     "summary": "Reproduces reports, hunts soft-locks with different player styles and tests in the browser.",
     "skill": "elitro-playtest",
     "instructions": "",
     "model": "claude-opus-5-5",
     "model_reason": "Last check before a human sees the work — catches subtle mistakes.",
     "capabilities": [
      "read",
      "write",
      "shell"
     ]
    }
   ],
   "flow": [
    {
     "id": "problema",
     "label": "Define the problem",
     "expert": "director",
     "after": [],
     "gate": null,
     "task": "",
     "action": null,
     "params": {},
     "edits": false,
     "hooks": {},
     "retry": 0,
     "reviews": null,
     "rounds": 0
    },
    {
     "id": "biologia",
     "label": "Biology research",
     "expert": "biologo",
     "after": [
      "problema"
     ],
     "gate": null,
     "task": "",
     "action": null,
     "params": {},
     "edits": false,
     "hooks": {},
     "retry": 0,
     "reviews": null,
     "rounds": 0
    },
    {
     "id": "referencias",
     "label": "Design references",
     "expert": "investigador",
     "after": [
      "problema"
     ],
     "gate": null,
     "task": "",
     "action": null,
     "params": {},
     "edits": false,
     "hooks": {},
     "retry": 0,
     "reviews": null,
     "rounds": 0
    },
    {
     "id": "economia",
     "label": "Economy analysis",
     "expert": "recursos",
     "after": [
      "problema"
     ],
     "gate": null,
     "task": "",
     "action": null,
     "params": {},
     "edits": false,
     "hooks": {},
     "retry": 0,
     "reviews": null,
     "rounds": 0
    },
    {
     "id": "espacio",
     "label": "Board analysis",
     "expert": "tablero",
     "after": [
      "problema"
     ],
     "gate": null,
     "task": "",
     "action": null,
     "params": {},
     "edits": false,
     "hooks": {},
     "retry": 0,
     "reviews": null,
     "rounds": 0
    },
    {
     "id": "propuesta",
     "label": "Change proposal",
     "expert": "director",
     "after": [
      "biologia",
      "referencias",
      "economia",
      "espacio"
     ],
     "gate": null,
     "task": "",
     "action": null,
     "params": {},
     "edits": false,
     "hooks": {},
     "retry": 0,
     "reviews": null,
     "rounds": 0
    },
    {
     "id": "ok_propuesta",
     "label": "Approve the proposal",
     "expert": null,
     "after": [
      "propuesta"
     ],
     "gate": "human",
     "task": "",
     "action": null,
     "params": {},
     "edits": false,
     "hooks": {},
     "retry": 0,
     "reviews": null,
     "rounds": 0
    },
    {
     "id": "disenar",
     "label": "Design cards",
     "expert": "cartas",
     "after": [
      "ok_propuesta"
     ],
     "gate": null,
     "task": "",
     "action": null,
     "params": {},
     "edits": false,
     "hooks": {},
     "retry": 0,
     "reviews": null,
     "rounds": 0
    },
    {
     "id": "implementar",
     "label": "Implement",
     "expert": "director",
     "after": [
      "disenar"
     ],
     "gate": null,
     "task": "",
     "action": null,
     "params": {},
     "edits": false,
     "hooks": {},
     "retry": 0,
     "reviews": null,
     "rounds": 0
    },
    {
     "id": "simular",
     "label": "Balance simulations",
     "expert": "balance",
     "after": [
      "implementar"
     ],
     "gate": null,
     "task": "",
     "action": null,
     "params": {},
     "edits": false,
     "hooks": {},
     "retry": 0,
     "reviews": null,
     "rounds": 0
    },
    {
     "id": "probar",
     "label": "Playtest & soft-locks",
     "expert": "playtest",
     "after": [
      "implementar"
     ],
     "gate": null,
     "task": "",
     "action": null,
     "params": {},
     "edits": false,
     "hooks": {},
     "retry": 0,
     "reviews": null,
     "rounds": 0
    },
    {
     "id": "ok_version",
     "label": "Approve the release",
     "expert": null,
     "after": [
      "simular",
      "probar"
     ],
     "gate": "human",
     "task": "",
     "action": null,
     "params": {},
     "edits": false,
     "hooks": {},
     "retry": 0,
     "reviews": null,
     "rounds": 0
    },
    {
     "id": "publicar",
     "label": "Ship the release",
     "expert": "director",
     "after": [
      "ok_version"
     ],
     "gate": null,
     "task": "",
     "action": null,
     "params": {},
     "edits": false,
     "hooks": {},
     "retry": 0,
     "reviews": null,
     "rounds": 0
    },
    {
     "id": "reporte_bug",
     "label": "Reproduce bug report",
     "expert": "playtest",
     "after": [],
     "gate": null,
     "task": "",
     "action": null,
     "params": {},
     "edits": false,
     "hooks": {},
     "retry": 0,
     "reviews": null,
     "rounds": 0
    }
   ],
   "levels": [
    [
     "problema",
     "reporte_bug"
    ],
    [
     "biologia",
     "referencias",
     "economia",
     "espacio"
    ],
    [
     "propuesta"
    ],
    [
     "ok_propuesta"
    ],
    [
     "disenar"
    ],
    [
     "implementar"
    ],
    [
     "simular",
     "probar"
    ],
    [
     "ok_version"
    ],
    [
     "publicar"
    ]
   ],
   "triggers": [
    {
     "id": "ciclo",
     "type": "manual",
     "name": "Improvement cycle",
     "schedule": null,
     "source": null,
     "event": null,
     "start": null,
     "only": [
      "problema",
      "biologia",
      "referencias",
      "economia",
      "espacio",
      "propuesta",
      "ok_propuesta",
      "disenar",
      "implementar",
      "simular",
      "probar",
      "ok_version",
      "publicar"
     ]
    },
    {
     "id": "bug",
     "type": "event",
     "name": "Issue labeled as bug",
     "schedule": null,
     "source": "github",
     "event": "issues.labeled",
     "start": null,
     "only": [
      "reporte_bug"
     ]
    },
    {
     "id": "nocturno",
     "type": "cron",
     "name": "Nightly balance run",
     "schedule": "0 3 * * *",
     "source": null,
     "event": null,
     "start": "simular",
     "only": []
    }
   ],
   "guardrails": [
    "One balance change at a time, measured with simulations.",
    "Take inspiration from other games without copying them.",
    "Mechanics must stay faithful to real biology.",
    "No release ships without human approval."
   ],
   "links": [],
   "environment": {
    "type": "Git worktree per improvement cycle",
    "repo": "elitro (private)",
    "runtime": "Browser card game · simulation scripts",
    "isolation": "Each cycle works on its own branch; research and simulations run in parallel.",
    "secrets": "None needed — everything runs locally."
   },
   "integrations": [
    {
     "id": "github",
     "kind": "api",
     "name": "GitHub",
     "used_by": [
      "playtest",
      "director"
     ],
     "purpose": "Issues labeled as bugs trigger a reproduction; releases are tagged."
    },
    {
     "id": "chrome",
     "kind": "mcp",
     "server": "claude-in-chrome",
     "name": "Claude in Chrome",
     "used_by": [
      "playtest"
     ],
     "purpose": "Plays the game in a real browser with real taps to find soft-locks."
    },
    {
     "id": "simulator",
     "kind": "cli",
     "name": "Match simulator",
     "used_by": [
      "balance",
      "recursos",
      "tablero"
     ],
     "purpose": "AI-vs-AI matches that measure win rates, game length and card strength."
    },
    {
     "id": "research",
     "kind": "browser",
     "name": "Web research",
     "used_by": [
      "biologo",
      "investigador"
     ],
     "purpose": "Biology sources and how other games solve similar problems."
    }
   ],
   "context": [
    {
     "kind": "skill",
     "name": "Skill instructions",
     "detail": "Each Expert's role, steps and checklists."
    },
    {
     "kind": "memory",
     "name": "Team memory",
     "detail": "Past balance changes and their results."
    },
    {
     "kind": "corrections",
     "name": "Corrections",
     "detail": "Rules learned when a human requested changes."
    },
    {
     "kind": "flow",
     "name": "Upstream outputs",
     "detail": "Research → proposal → cards → simulations."
    },
    {
     "kind": "data",
     "name": "Simulation reports",
     "detail": "Win rates per queen, mirror matches and card strength."
    }
   ],
   "corrections": [
    "Change one balance variable at a time and measure it.",
    "Every mechanic cites how the real animal behaves.",
    "Card text has to stay readable on a phone."
   ],
   "on_failure": [],
   "memory": "- 2026-11-07 16:35 · Session e8c0a1ae2d completed (bug) with 1 steps.\n- 2026-11-07 16:35 · Session c28bb377a8 completed (nocturno) with 3 steps.\n",
   "expert_stats": {
    "balance": {
     "expert": "balance",
     "steps": 2,
     "avg_s": 122.8,
     "cost": 0.3527
    },
    "biologo": {
     "expert": "biologo",
     "steps": 1,
     "avg_s": 239.7,
     "cost": 0.1522
    },
    "cartas": {
     "expert": "cartas",
     "steps": 1,
     "avg_s": 199.8,
     "cost": 0.3305
    },
    "director": {
     "expert": "director",
     "steps": 4,
     "avg_s": 91.3,
     "cost": 1.1525
    },
    "investigador": {
     "expert": "investigador",
     "steps": 1,
     "avg_s": 37.4,
     "cost": 0.3483
    },
    "playtest": {
     "expert": "playtest",
     "steps": 2,
     "avg_s": 171.1,
     "cost": 0.126
    },
    "recursos": {
     "expert": "recursos",
     "steps": 1,
     "avg_s": 79.8,
     "cost": 0.1802
    },
    "tablero": {
     "expert": "tablero",
     "steps": 1,
     "avg_s": 174.9,
     "cost": 0.2744
    },
    "_gates": {
     "awaiting_approval": 1,
     "done": 2
    }
   }
  },
  {
   "id": "ofertasradar",
   "name": "Ofertas Radar MX",
   "tagline": "An editorial team that finds, verifies, designs and publishes real deals across 4 channels.",
   "domain": "Affiliate marketing · Social media",
   "lead": "ceo",
   "color": "#e8590c",
   "experts": [
    {
     "id": "ceo",
     "name": "CEO",
     "role": "orchestrator",
     "summary": "Plans the day, sets the theme and the daily experiment, assigns the work and hands everything over ready for approval.",
     "skill": "ofertas-ceo",
     "instructions": "",
     "model": "claude-opus-5-5",
     "model_reason": "Plans, delegates and makes judgment calls — gets the strongest reasoning.",
     "capabilities": [
      "read",
      "write",
      "shell"
     ]
    },
    {
     "id": "vigilante",
     "name": "Price Watcher",
     "role": "specialist",
     "summary": "Rechecks yesterday's posts; updates deals whose price went up or sold out and flags the ones that dropped further.",
     "skill": "ofertas-vigilante",
     "instructions": "",
     "model": "claude-sonnet-5-5",
     "model_reason": "Fast, capable model for focused production work.",
     "capabilities": [
      "read",
      "write",
      "web"
     ]
    },
    {
     "id": "cazador",
     "name": "Deal Hunter",
     "role": "specialist",
     "summary": "Searches by category, verifies price and seller on the live product page and writes the batch data.",
     "skill": "ofertas-cazador",
     "instructions": "",
     "model": "claude-sonnet-5-5",
     "model_reason": "Fast, capable model for focused production work.",
     "capabilities": [
      "read",
      "write",
      "web"
     ]
    },
    {
     "id": "peticiones",
     "name": "Request Finder",
     "role": "specialist",
     "summary": "When a follower asks for a product, builds a catalog of options as a dry run (nothing is published).",
     "skill": "ofertas-peticiones",
     "instructions": "",
     "model": "claude-sonnet-5-5",
     "model_reason": "Fast, capable model for focused production work.",
     "capabilities": [
      "read",
      "write",
      "web"
     ]
    },
    {
     "id": "social",
     "name": "Social Media Manager",
     "role": "specialist",
     "summary": "Spots local trends and creates original memes and engagement posts.",
     "skill": "ofertas-social-media",
     "instructions": "",
     "model": "claude-sonnet-5-5",
     "model_reason": "Fast, capable model for focused production work.",
     "capabilities": [
      "read",
      "write",
      "web"
     ]
    },
    {
     "id": "diseno",
     "name": "Post Designer",
     "role": "specialist",
     "summary": "Renders images for every channel with rotating styles and reviews each render before handing it off.",
     "skill": null,
     "instructions": "Render posts, stories and contact sheets rotating styles; check text overlap, glyphs, prices and crops.",
     "model": "claude-sonnet-5-5",
     "model_reason": "Fast, capable model for focused production work.",
     "capabilities": [
      "read",
      "write",
      "shell"
     ]
    },
    {
     "id": "video",
     "name": "Video Editor",
     "role": "specialist",
     "summary": "Vertical Reels and TikToks with a first-second hook and rotating formats.",
     "skill": "ofertas-video",
     "instructions": "",
     "model": "claude-sonnet-5-5",
     "model_reason": "Fast, capable model for focused production work.",
     "capabilities": [
      "read",
      "write",
      "shell"
     ]
    },
    {
     "id": "copy",
     "name": "Copywriter",
     "role": "specialist",
     "summary": "Per-channel captions, hashtags and alt text.",
     "skill": null,
     "instructions": "Write per-channel captions with searchable keywords, 3–5 hashtags, alt text and a closing question.",
     "model": "claude-sonnet-5-5",
     "model_reason": "Fast, capable model for focused production work.",
     "capabilities": [
      "read",
      "write"
     ]
    },
    {
     "id": "cumplimiento",
     "name": "Ad Compliance",
     "role": "reviewer",
     "summary": "Checks links, ad disclosure, price footer and claims before anything reaches a human.",
     "skill": null,
     "instructions": "Verify per-channel links, the ad disclosure tag, the dated price footer and that only claims visible on the page are made.",
     "model": "claude-opus-5-5",
     "model_reason": "Last check before a human sees the work — catches subtle mistakes.",
     "capabilities": [
      "read",
      "shell"
     ]
    },
    {
     "id": "publicador",
     "name": "Publisher",
     "role": "specialist",
     "summary": "Publishes in order Telegram → WhatsApp → website → Instagram and verifies each post.",
     "skill": "ofertas-publicador",
     "instructions": "",
     "model": "claude-sonnet-5-5",
     "model_reason": "Fast, capable model for focused production work.",
     "capabilities": [
      "read",
      "write"
     ]
    },
    {
     "id": "web",
     "name": "Web Expert",
     "role": "specialist",
     "summary": "Regenerates the bio-link website and deploys it to GitHub Pages after every publish.",
     "skill": "ofertas-web",
     "instructions": "",
     "model": "claude-sonnet-5-5",
     "model_reason": "Fast, capable model for focused production work.",
     "capabilities": [
      "read",
      "write",
      "shell"
     ]
    },
    {
     "id": "analista",
     "name": "Analyst",
     "role": "specialist",
     "summary": "Clicks, sales and commissions per link and channel; decides what to repeat and what to drop.",
     "skill": "ofertas-analista",
     "instructions": "",
     "model": "claude-sonnet-5-5",
     "model_reason": "Fast, capable model for focused production work.",
     "capabilities": [
      "read",
      "write",
      "web"
     ]
    },
    {
     "id": "janitor",
     "name": "Janitor",
     "role": "specialist",
     "summary": "Cleans up tests and old renders without touching the records; versioned files only with human OK.",
     "skill": "ofertas-janitor",
     "instructions": "",
     "model": "claude-haiku-5-5",
     "model_reason": "Simple, repetitive cleanup — the smallest model is enough.",
     "capabilities": [
      "read",
      "write",
      "shell"
     ]
    }
   ],
   "flow": [
    {
     "id": "vigilar",
     "label": "Recheck published deals",
     "expert": "vigilante",
     "after": [],
     "gate": null,
     "task": "Review the deals published yesterday and update prices that changed.",
     "action": null,
     "params": {},
     "edits": false,
     "hooks": {},
     "retry": 0,
     "reviews": null,
     "rounds": 0
    },
    {
     "id": "plan",
     "label": "Plan the day",
     "expert": "ceo",
     "after": [
      "vigilar"
     ],
     "gate": null,
     "task": "Set the theme, beauty topic, engagement format, channel to promote and the experiment of the day.",
     "action": null,
     "params": {},
     "edits": false,
     "hooks": {},
     "retry": 0,
     "reviews": null,
     "rounds": 0
    },
    {
     "id": "cazar",
     "label": "Find & verify deals",
     "expert": "cazador",
     "after": [
      "plan"
     ],
     "gate": null,
     "task": "Find the mega deal, beauty, themed deals and pending requests; verify every price today.",
     "action": null,
     "params": {},
     "edits": false,
     "hooks": {},
     "retry": 0,
     "reviews": null,
     "rounds": 0
    },
    {
     "id": "engagement",
     "label": "Engagement post",
     "expert": "social",
     "after": [
      "plan"
     ],
     "gate": null,
     "task": "",
     "action": null,
     "params": {},
     "edits": false,
     "hooks": {},
     "retry": 0,
     "reviews": null,
     "rounds": 0
    },
    {
     "id": "disenar",
     "label": "Design posts & stories",
     "expert": "diseno",
     "after": [
      "cazar"
     ],
     "gate": null,
     "task": "",
     "action": null,
     "params": {},
     "edits": false,
     "hooks": {},
     "retry": 0,
     "reviews": null,
     "rounds": 0
    },
    {
     "id": "redactar",
     "label": "Write captions",
     "expert": "copy",
     "after": [
      "cazar"
     ],
     "gate": null,
     "task": "",
     "action": null,
     "params": {},
     "edits": false,
     "hooks": {},
     "retry": 0,
     "reviews": null,
     "rounds": 0
    },
    {
     "id": "video",
     "label": "Edit video",
     "expert": "video",
     "after": [
      "cazar"
     ],
     "gate": null,
     "task": "",
     "action": null,
     "params": {},
     "edits": false,
     "hooks": {},
     "retry": 0,
     "reviews": null,
     "rounds": 0
    },
    {
     "id": "revisar",
     "label": "Compliance review",
     "expert": "cumplimiento",
     "after": [
      "disenar",
      "redactar",
      "video",
      "engagement"
     ],
     "gate": null,
     "task": "",
     "action": null,
     "params": {},
     "edits": false,
     "hooks": {},
     "retry": 0,
     "reviews": null,
     "rounds": 0
    },
    {
     "id": "aprobar",
     "label": "Preview & owner approval",
     "expert": null,
     "after": [
      "revisar"
     ],
     "gate": "human",
     "task": "",
     "action": null,
     "params": {},
     "edits": false,
     "hooks": {},
     "retry": 0,
     "reviews": null,
     "rounds": 0
    },
    {
     "id": "publicar",
     "label": "Publish to channels",
     "expert": "publicador",
     "after": [
      "aprobar"
     ],
     "gate": null,
     "task": "",
     "action": null,
     "params": {},
     "edits": false,
     "hooks": {},
     "retry": 0,
     "reviews": null,
     "rounds": 0
    },
    {
     "id": "pagina",
     "label": "Update website",
     "expert": "web",
     "after": [
      "publicar"
     ],
     "gate": null,
     "task": "",
     "action": null,
     "params": {},
     "edits": false,
     "hooks": {},
     "retry": 0,
     "reviews": null,
     "rounds": 0
    },
    {
     "id": "metricas",
     "label": "Daily metrics",
     "expert": "analista",
     "after": [
      "pagina"
     ],
     "gate": null,
     "task": "",
     "action": null,
     "params": {},
     "edits": false,
     "hooks": {},
     "retry": 0,
     "reviews": null,
     "rounds": 0
    },
    {
     "id": "limpiar",
     "label": "Repo cleanup",
     "expert": "janitor",
     "after": [
      "pagina"
     ],
     "gate": null,
     "task": "",
     "action": null,
     "params": {},
     "edits": false,
     "hooks": {},
     "retry": 0,
     "reviews": null,
     "rounds": 0
    },
    {
     "id": "pedido",
     "label": "Catalog for a follower",
     "expert": "peticiones",
     "after": [],
     "gate": null,
     "task": "Find the requested product and 3–8 similar ones; deliver a dry-run catalog only.",
     "action": null,
     "params": {},
     "edits": false,
     "hooks": {},
     "retry": 0,
     "reviews": null,
     "rounds": 0
    },
    {
     "id": "aprobar_pedido",
     "label": "Approve reply to follower",
     "expert": null,
     "after": [
      "pedido"
     ],
     "gate": "human",
     "task": "",
     "action": null,
     "params": {},
     "edits": false,
     "hooks": {},
     "retry": 0,
     "reviews": null,
     "rounds": 0
    }
   ],
   "levels": [
    [
     "vigilar",
     "pedido"
    ],
    [
     "plan",
     "aprobar_pedido"
    ],
    [
     "cazar",
     "engagement"
    ],
    [
     "disenar",
     "redactar",
     "video"
    ],
    [
     "revisar"
    ],
    [
     "aprobar"
    ],
    [
     "publicar"
    ],
    [
     "pagina"
    ],
    [
     "metricas",
     "limpiar"
    ]
   ],
   "triggers": [
    {
     "id": "dia",
     "type": "cron",
     "name": "Daily edition",
     "schedule": "0 5 * * *",
     "source": null,
     "event": null,
     "start": null,
     "only": [
      "vigilar",
      "plan",
      "cazar",
      "engagement",
      "disenar",
      "redactar",
      "video",
      "revisar",
      "aprobar",
      "publicar",
      "pagina"
     ]
    },
    {
     "id": "noche",
     "type": "cron",
     "name": "Night edition",
     "schedule": "0 20 * * *",
     "source": null,
     "event": null,
     "start": null,
     "only": [
      "plan",
      "cazar",
      "disenar",
      "redactar",
      "revisar",
      "aprobar",
      "publicar",
      "pagina"
     ]
    },
    {
     "id": "cierre",
     "type": "cron",
     "name": "End-of-day wrap-up",
     "schedule": "30 23 * * *",
     "source": null,
     "event": null,
     "start": null,
     "only": [
      "metricas",
      "limpiar"
     ]
    },
    {
     "id": "peticion",
     "type": "event",
     "name": "A follower requests a product",
     "schedule": null,
     "source": "telegram",
     "event": "peticion",
     "start": null,
     "only": [
      "pedido",
      "aprobar_pedido"
     ]
    }
   ],
   "guardrails": [
    "Nothing is published without explicit human approval.",
    "Every price is verified the same day on the live page; no invented reviews or claims.",
    "Every post carries the ad disclosure and a dated \"price may change\" footer.",
    "No account creation, passwords or tokens; no unofficial tools.",
    "Posts are never deleted; if a price changes, the post is edited with a notice."
   ],
   "links": [
    {
     "label": "Live site",
     "url": "https://fabiannabi.github.io/ofertasradar/"
    },
    {
     "label": "@ofertasradar.mx",
     "url": "https://www.instagram.com/ofertasradar.mx/"
    }
   ],
   "environment": {
    "type": "Git worktree per session",
    "repo": "ofertasradar-bot (private)",
    "runtime": "Node.js renderer · Chrome",
    "isolation": "One signed-in Chrome profile, so browser steps run one at a time; render and copy run in parallel.",
    "secrets": "Bot token and affiliate session stay in the OS — never in the repo or in prompts."
   },
   "integrations": [
    {
     "id": "chrome",
     "kind": "mcp",
     "server": "claude-in-chrome",
     "name": "Claude in Chrome",
     "used_by": [
      "vigilante",
      "cazador",
      "peticiones",
      "publicador",
      "analista"
     ],
     "purpose": "Browses listings, builds affiliate links, publishes and reads metrics in a real browser."
    },
    {
     "id": "mercadolibre",
     "kind": "browser",
     "name": "Mercado Libre Affiliates",
     "used_by": [
      "cazador",
      "vigilante",
      "analista"
     ],
     "purpose": "Verifies price and seller on the live page; affiliate link builder; clicks and commissions."
    },
    {
     "id": "telegram",
     "kind": "api",
     "name": "Telegram Bot API",
     "used_by": [
      "publicador"
     ],
     "purpose": "Posts to the channel and sends previews to the owner for approval."
    },
    {
     "id": "whatsapp",
     "kind": "browser",
     "name": "WhatsApp Channels",
     "used_by": [
      "publicador"
     ],
     "purpose": "Official web client only — no unofficial APIs."
    },
    {
     "id": "instagram",
     "kind": "browser",
     "name": "Instagram",
     "used_by": [
      "publicador",
      "social",
      "analista"
     ],
     "purpose": "Posts, stories with links and follower metrics."
    },
    {
     "id": "tiktok",
     "kind": "manual",
     "name": "TikTok",
     "used_by": [
      "video"
     ],
     "purpose": "Videos are handed off; the owner uploads them from the phone."
    },
    {
     "id": "pages",
     "kind": "cli",
     "name": "GitHub Pages",
     "used_by": [
      "web"
     ],
     "purpose": "Regenerates the bio-link site and deploys it after every publish."
    },
    {
     "id": "renderer",
     "kind": "cli",
     "name": "Post & video renderer",
     "used_by": [
      "diseno",
      "video"
     ],
     "purpose": "Renders posts, stories and vertical videos from the batch data."
    }
   ],
   "context": [
    {
     "kind": "skill",
     "name": "Skill instructions",
     "detail": "Each Expert's role, steps and checklists."
    },
    {
     "kind": "memory",
     "name": "Team memory",
     "detail": "Notes from earlier sessions."
    },
    {
     "kind": "corrections",
     "name": "Corrections",
     "detail": "Rules learned when a human requested changes."
    },
    {
     "kind": "flow",
     "name": "Upstream outputs",
     "detail": "What the previous steps delivered."
    },
    {
     "kind": "doc",
     "name": "Posting bible",
     "detail": "Brand, honesty and disclosure rules — it overrides everything else."
    },
    {
     "kind": "doc",
     "name": "Published log",
     "detail": "Everything already posted, to avoid duplicates."
    },
    {
     "kind": "data",
     "name": "Batch data",
     "detail": "The day's verified deals as JSON — the single source of truth."
    }
   ],
   "corrections": [
    "Mega deal copy never says “lowest price ever” — it says “-X% today”.",
    "Never repeat yesterday's post style or video format.",
    "The link sticker moves to a different spot on each story.",
    "Always call out international shipping."
   ],
   "on_failure": [],
   "memory": "- 2026-11-07 16:35 · Price Watcher: in \"Recheck published deals\", validate the input before starting.\n- 2026-11-07 16:35 · CEO: in \"Plan the day\", validate the input before starting.\n- 2026-11-07 16:35 · Copywriter: in \"Write captions\", validate the input before starting.\n- 2026-11-07 16:35 · Session a0e757c1bf completed (noche) with 8 steps.\n- 2026-11-07 16:35 · Session 2ee5e8e9c5 completed (cierre) with 2 steps.\n- 2026-11-07 16:35 · Request Finder: in \"Catalog for a follower\", validate the input before starting.\n",
   "expert_stats": {
    "analista": {
     "expert": "analista",
     "steps": 1,
     "avg_s": 133.1,
     "cost": 0.2855
    },
    "cazador": {
     "expert": "cazador",
     "steps": 2,
     "avg_s": 131.6,
     "cost": 0.4835
    },
    "ceo": {
     "expert": "ceo",
     "steps": 2,
     "avg_s": 209.0,
     "cost": 0.3825
    },
    "copy": {
     "expert": "copy",
     "steps": 2,
     "avg_s": 138.5,
     "cost": 0.2448
    },
    "cumplimiento": {
     "expert": "cumplimiento",
     "steps": 2,
     "avg_s": 118.7,
     "cost": 0.3346
    },
    "diseno": {
     "expert": "diseno",
     "steps": 2,
     "avg_s": 128.0,
     "cost": 0.5173
    },
    "janitor": {
     "expert": "janitor",
     "steps": 1,
     "avg_s": 36.5,
     "cost": 0.2159
    },
    "peticiones": {
     "expert": "peticiones",
     "steps": 1,
     "avg_s": 144.3,
     "cost": 0.0869
    },
    "publicador": {
     "expert": "publicador",
     "steps": 1,
     "avg_s": 84.7,
     "cost": 0.1373
    },
    "social": {
     "expert": "social",
     "steps": 1,
     "avg_s": 238.9,
     "cost": 0.1583
    },
    "video": {
     "expert": "video",
     "steps": 1,
     "avg_s": 223.3,
     "cost": 0.2102
    },
    "vigilante": {
     "expert": "vigilante",
     "steps": 1,
     "avg_s": 156.8,
     "cost": 0.1137
    },
    "web": {
     "expert": "web",
     "steps": 1,
     "avg_s": 190.0,
     "cost": 0.3153
    },
    "_gates": {
     "awaiting_approval": 2,
     "done": 1
    }
   }
  }
 ],
 "platform": {
  "mcp_servers": [
   {
    "id": "blueprint",
    "name": "Blueprint",
    "transport": "stdio",
    "built_here": true,
    "purpose": "The author's own design system as an MCP server. Agents look up components and tokens, check WCAG contrast and lint the UI they write. This dashboard is built on it and passes its linter with zero findings.",
    "used_for": "Builds and lints this dashboard · graded in the Blueprint MCP eval",
    "install": "claude mcp add blueprint -- npx -y @fabiannabi/blueprint-mcp@0.1.2",
    "links": [
     {
      "label": "npm",
      "url": "https://www.npmjs.com/package/@fabiannabi/blueprint-mcp"
     },
     {
      "label": "Docs",
      "url": "https://fabiannabi.github.io/design/#agents"
     },
     {
      "label": "Source",
      "url": "https://github.com/fabiannabi/fabiannabi.github.io/tree/main/packages/blueprint-mcp"
     },
     {
      "label": "Security",
      "url": "https://github.com/fabiannabi/fabiannabi.github.io/blob/main/packages/blueprint-mcp/SECURITY.md"
     }
    ]
   },
   {
    "id": "claude-in-chrome",
    "name": "Claude in Chrome",
    "transport": "browser extension",
    "purpose": "Acts in a real, signed-in Chrome session — search listings, build affiliate links and publish to social channels."
   },
   {
    "id": "elevenlabs",
    "name": "ElevenLabs",
    "transport": "stdio",
    "purpose": "Narration with word timings, music and sound effects for the science videos."
   },
   {
    "id": "pixellab",
    "name": "PixelLab",
    "transport": "http",
    "purpose": "AI pixel-art generation for sprites and game assets."
   },
   {
    "id": "blender",
    "name": "Blender",
    "transport": "stdio",
    "purpose": "Builds and renders 3D scenes in Blender from code."
   }
  ],
  "routing": {
   "default": {
    "model": "claude-sonnet-5-5",
    "reason": "Fast, capable model for focused production work."
   },
   "rules": [
    {
     "roles": [
      "orchestrator"
     ],
     "model": "claude-opus-5-5",
     "reason": "Plans, delegates and makes judgment calls — gets the strongest reasoning."
    },
    {
     "roles": [
      "reviewer"
     ],
     "model": "claude-opus-5-5",
     "reason": "Last check before a human sees the work — catches subtle mistakes."
    }
   ]
  }
 },
 "evals": {
  "generated": "2026-11-07",
  "teams": {
   "ciencia-lab": {
    "items": {
     "episode": 10
    },
    "score": 95.7,
    "checks": 46,
    "experts": {
     "qa": {
      "score": 100.0,
      "checks": 8
     },
     "guionista": {
      "score": 100.0,
      "checks": 18
     },
     "factcheck": {
      "score": 100.0,
      "checks": 10
     },
     "investigador": {
      "score": 80.0,
      "checks": 10
     }
    },
    "evals": [
     {
      "id": "loudness",
      "name": "Final mix at −14 LUFS (±1)",
      "expert": "qa",
      "target": "episode",
      "grader": "in_range",
      "kind": "rule",
      "why": "Platform loudness target; too quiet loses viewers, too loud gets turned down.",
      "passed": 8,
      "failed": 0,
      "skipped": 2,
      "score": 100.0,
      "trend": [
       {
        "period": "2026-W44",
        "score": 100.0,
        "n": 6
       }
      ],
      "regression": false,
      "failures": []
     },
     {
      "id": "length",
      "name": "61–90 seconds",
      "expert": "guionista",
      "target": "episode",
      "grader": "in_range",
      "kind": "rule",
      "why": "Long enough to explain, short enough to keep retention.",
      "passed": 8,
      "failed": 0,
      "skipped": 2,
      "score": 100.0,
      "trend": [
       {
        "period": "2026-W44",
        "score": 100.0,
        "n": 6
       }
      ],
      "regression": false,
      "failures": []
     },
     {
      "id": "fact-checked",
      "name": "Fact-check report before voice and render",
      "expert": "factcheck",
      "target": "episode",
      "grader": "field_present",
      "kind": "rule",
      "why": "No claim reaches voice or render without a fact-check.",
      "passed": 10,
      "failed": 0,
      "skipped": 0,
      "score": 100.0,
      "trend": [
       {
        "period": "2026-W44",
        "score": 100.0,
        "n": 6
       },
       {
        "period": "2026-W45",
        "score": 100.0,
        "n": 2
       }
      ],
      "regression": false,
      "failures": []
     },
     {
      "id": "sources",
      "name": "At least 3 cited sources",
      "expert": "investigador",
      "target": "episode",
      "grader": "at_least",
      "kind": "rule",
      "why": "Every brief is built from primary sources, published with the video.",
      "passed": 8,
      "failed": 2,
      "skipped": 0,
      "score": 80.0,
      "trend": [
       {
        "period": "2026-W44",
        "score": 66.7,
        "n": 6
       },
       {
        "period": "2026-W45",
        "score": 100.0,
        "n": 2
       }
      ],
      "regression": false,
      "failures": [
       {
        "where": "onion",
        "detail": "sources = 1 (expected ≥ 3)"
       },
       {
        "where": "penicillin",
        "detail": "sources = 2 (expected ≥ 3)"
       }
      ]
     },
     {
      "id": "script",
      "name": "Beat-by-beat script on file",
      "expert": "guionista",
      "target": "episode",
      "grader": "field_present",
      "kind": "rule",
      "why": "Voice and animation are synced from the structured script.",
      "passed": 10,
      "failed": 0,
      "skipped": 0,
      "score": 100.0,
      "trend": [
       {
        "period": "2026-W44",
        "score": 100.0,
        "n": 6
       },
       {
        "period": "2026-W45",
        "score": 100.0,
        "n": 2
       }
      ],
      "regression": false,
      "failures": []
     },
     {
      "id": "hook",
      "name": "Hook lands in the first second (LLM judge)",
      "expert": "guionista",
      "target": "episode",
      "grader": "judge",
      "kind": "judge",
      "why": "Retention drops fastest in the first seconds.",
      "passed": 0,
      "failed": 0,
      "skipped": 10,
      "score": null,
      "trend": [],
      "regression": false,
      "failures": []
     }
    ],
    "regressions": [],
    "dataset": "connected"
   },
   "elitro-lab": {
    "items": {},
    "score": null,
    "checks": 0,
    "experts": {},
    "evals": [
     {
      "id": "one-variable",
      "name": "One balance variable changed per release",
      "expert": "balance",
      "target": "balance_report",
      "grader": "judge",
      "kind": "judge",
      "why": "Changing several numbers at once hides which one fixed the problem.",
      "passed": 0,
      "failed": 0,
      "skipped": 0,
      "score": null,
      "trend": [],
      "regression": false,
      "failures": []
     },
     {
      "id": "biology-cited",
      "name": "Every new mechanic cites real behavior",
      "expert": "biologo",
      "target": "card_design",
      "grader": "judge",
      "kind": "judge",
      "why": "Mechanics must stay faithful to how the animal really behaves.",
      "passed": 0,
      "failed": 0,
      "skipped": 0,
      "score": null,
      "trend": [],
      "regression": false,
      "failures": []
     }
    ],
    "regressions": [],
    "dataset": "not connected"
   },
   "ofertasradar": {
    "items": {
     "deal": 328,
     "ig_caption": 38
    },
    "score": 92.7,
    "checks": 1866,
    "experts": {
     "copy": {
      "score": 98.2,
      "checks": 114
     },
     "cumplimiento": {
      "score": 100.0,
      "checks": 114
     },
     "cazador": {
      "score": 91.8,
      "checks": 1638
     }
    },
    "evals": [
     {
      "id": "alt-text",
      "name": "Every post has alt text",
      "expert": "copy",
      "target": "ig_caption",
      "grader": "contains",
      "kind": "rule",
      "why": "Accessibility, and Instagram uses it to understand the image.",
      "passed": 38,
      "failed": 0,
      "skipped": 0,
      "score": 100.0,
      "trend": [
       {
        "period": "2026-W43",
        "score": 100.0,
        "n": 5
       },
       {
        "period": "2026-W44",
        "score": 100.0,
        "n": 18
       },
       {
        "period": "2026-W45",
        "score": 100.0,
        "n": 15
       }
      ],
      "regression": false,
      "failures": []
     },
     {
      "id": "hashtags",
      "name": "3–5 hashtags",
      "expert": "copy",
      "target": "ig_caption",
      "grader": "count_between",
      "kind": "rule",
      "why": "The posting bible asks for a few searchable hashtags, not a wall of them.",
      "passed": 38,
      "failed": 0,
      "skipped": 0,
      "score": 100.0,
      "trend": [
       {
        "period": "2026-W43",
        "score": 100.0,
        "n": 5
       },
       {
        "period": "2026-W44",
        "score": 100.0,
        "n": 18
       },
       {
        "period": "2026-W45",
        "score": 100.0,
        "n": 15
       }
      ],
      "regression": false,
      "failures": []
     },
     {
      "id": "searchable-hook",
      "name": "First line uses words people search",
      "expert": "copy",
      "target": "ig_caption",
      "grader": "first_line_matches",
      "kind": "rule",
      "why": "Instagram search reads the caption, so the first line names the store or the deal.",
      "passed": 36,
      "failed": 2,
      "skipped": 0,
      "score": 94.7,
      "trend": [
       {
        "period": "2026-W43",
        "score": 60.0,
        "n": 5
       },
       {
        "period": "2026-W44",
        "score": 100.0,
        "n": 18
       },
       {
        "period": "2026-W45",
        "score": 100.0,
        "n": 15
       }
      ],
      "regression": false,
      "failures": [
       {
        "where": "IG 2026-10-24 · post de belleza",
        "detail": "first line has no searchable keyword"
       },
       {
        "where": "IG 2026-10-24 · post general",
        "detail": "first line has no searchable keyword"
       }
      ]
     },
     {
      "id": "tone",
      "name": "Short, clear Mexican Spanish (LLM judge)",
      "expert": "copy",
      "target": "ig_caption",
      "grader": "judge",
      "kind": "judge",
      "why": "Style can't be checked with a regex, so a model grades it against a rubric.",
      "passed": 0,
      "failed": 0,
      "skipped": 38,
      "score": null,
      "trend": [],
      "regression": false,
      "failures": []
     },
     {
      "id": "ad-disclosure",
      "name": "Ad disclosure tag (#publicidad)",
      "expert": "cumplimiento",
      "target": "ig_caption",
      "grader": "contains",
      "kind": "rule",
      "why": "Affiliate posts must be labeled as advertising.",
      "passed": 38,
      "failed": 0,
      "skipped": 0,
      "score": 100.0,
      "trend": [
       {
        "period": "2026-W43",
        "score": 100.0,
        "n": 5
       },
       {
        "period": "2026-W44",
        "score": 100.0,
        "n": 18
       },
       {
        "period": "2026-W45",
        "score": 100.0,
        "n": 15
       }
      ],
      "regression": false,
      "failures": []
     },
     {
      "id": "dated-price",
      "name": "Dated \"prices may change\" footer",
      "expert": "cumplimiento",
      "target": "ig_caption",
      "grader": "contains",
      "kind": "rule",
      "why": "Prices move; every post says the day it was checked.",
      "passed": 38,
      "failed": 0,
      "skipped": 0,
      "score": 100.0,
      "trend": [
       {
        "period": "2026-W43",
        "score": 100.0,
        "n": 5
       },
       {
        "period": "2026-W44",
        "score": 100.0,
        "n": 18
       },
       {
        "period": "2026-W45",
        "score": 100.0,
        "n": 15
       }
      ],
      "regression": false,
      "failures": []
     },
     {
      "id": "no-overclaims",
      "name": "No unverifiable claims",
      "expert": "cumplimiento",
      "target": "ig_caption",
      "grader": "not_contains",
      "kind": "rule",
      "why": "Never \"lowest price ever\" — only what the product page shows.",
      "passed": 38,
      "failed": 0,
      "skipped": 0,
      "score": 100.0,
      "trend": [
       {
        "period": "2026-W43",
        "score": 100.0,
        "n": 5
       },
       {
        "period": "2026-W44",
        "score": 100.0,
        "n": 18
       },
       {
        "period": "2026-W45",
        "score": 100.0,
        "n": 15
       }
      ],
      "regression": false,
      "failures": []
     },
     {
      "id": "discount-math",
      "name": "Discount matches the prices",
      "expert": "cazador",
      "target": "deal",
      "grader": "discount_math",
      "kind": "rule",
      "why": "The advertised -X% must come from the before/after prices.",
      "passed": 326,
      "failed": 0,
      "skipped": 2,
      "score": 100.0,
      "trend": [
       {
        "period": "2026-W43",
        "score": 100.0,
        "n": 115
       },
       {
        "period": "2026-W44",
        "score": 100.0,
        "n": 126
       },
       {
        "period": "2026-W45",
        "score": 100.0,
        "n": 85
       }
      ],
      "regression": false,
      "failures": []
     },
     {
      "id": "affiliate-link",
      "name": "Affiliate short link",
      "expert": "cazador",
      "target": "deal",
      "grader": "field_matches",
      "kind": "rule",
      "why": "Without the affiliate link the click earns nothing.",
      "passed": 328,
      "failed": 0,
      "skipped": 0,
      "score": 100.0,
      "trend": [
       {
        "period": "2026-W43",
        "score": 100.0,
        "n": 115
       },
       {
        "period": "2026-W44",
        "score": 100.0,
        "n": 128
       },
       {
        "period": "2026-W45",
        "score": 100.0,
        "n": 85
       }
      ],
      "regression": false,
      "failures": []
     },
     {
      "id": "channel-links",
      "name": "One tracked link per channel",
      "expert": "cazador",
      "target": "deal",
      "grader": "has_items",
      "kind": "rule",
      "why": "Separate links for Telegram, WhatsApp and Instagram are how clicks and sales are attributed.",
      "passed": 235,
      "failed": 93,
      "skipped": 0,
      "score": 71.6,
      "trend": [
       {
        "period": "2026-W43",
        "score": 34.8,
        "n": 115
       },
       {
        "period": "2026-W44",
        "score": 85.9,
        "n": 128
       },
       {
        "period": "2026-W45",
        "score": 100.0,
        "n": 85
       }
      ],
      "regression": false,
      "failures": [
       {
        "where": "lote-01 · luz de influencer",
        "detail": "only 0 of ['ig', 'tg', 'wa'] (channel links)"
       },
       {
        "where": "lote-01 · dura todo el día",
        "detail": "only 0 of ['ig', 'tg', 'wa'] (channel links)"
       },
       {
        "where": "lote-01 · meal prep",
        "detail": "only 0 of ['ig', 'tg', 'wa'] (channel links)"
       },
       {
        "where": "lote-01 · el sérum viral",
        "detail": "only 0 of ['ig', 'tg', 'wa'] (channel links)"
       }
      ]
     },
     {
      "id": "trust-signal",
      "name": "Rating / sales / official-store signal",
      "expert": "cazador",
      "target": "deal",
      "grader": "field_present",
      "kind": "rule",
      "why": "Shoppers trust deals with a visible seller signal.",
      "passed": 321,
      "failed": 7,
      "skipped": 0,
      "score": 97.9,
      "trend": [
       {
        "period": "2026-W43",
        "score": 100.0,
        "n": 115
       },
       {
        "period": "2026-W44",
        "score": 94.5,
        "n": 128
       },
       {
        "period": "2026-W45",
        "score": 100.0,
        "n": 85
       }
      ],
      "regression": false,
      "failures": [
       {
        "where": "lote-13 · Austen obras completas",
        "detail": "no trust signal"
       },
       {
        "where": "lote-13 · Cumbres borrascosas",
        "detail": "no trust signal"
       },
       {
        "where": "lote-13 · Dorian Gray ilustrado",
        "detail": "no trust signal"
       },
       {
        "where": "lote-13 · Emma",
        "detail": "no trust signal"
       }
      ]
     },
     {
      "id": "verified-source",
      "name": "Price verified on the seller's page",
      "expert": "cazador",
      "target": "deal",
      "grader": "field_present",
      "kind": "rule",
      "why": "Every deal records the page where its price was checked today.",
      "passed": 294,
      "failed": 34,
      "skipped": 0,
      "score": 89.6,
      "trend": [
       {
        "period": "2026-W43",
        "score": 70.4,
        "n": 115
       },
       {
        "period": "2026-W44",
        "score": 100.0,
        "n": 128
       },
       {
        "period": "2026-W45",
        "score": 100.0,
        "n": 85
       }
      ],
      "regression": false,
      "failures": [
       {
        "where": "lote-01 · luz de influencer",
        "detail": "no verified source page"
       },
       {
        "where": "lote-01 · dura todo el día",
        "detail": "no verified source page"
       },
       {
        "where": "lote-01 · meal prep",
        "detail": "no verified source page"
       },
       {
        "where": "lote-01 · el sérum viral",
        "detail": "no verified source page"
       }
      ]
     }
    ],
    "regressions": [],
    "dataset": "connected"
   }
  },
  "blueprint_ui": {
   "tasks": [
    {
     "id": "delete-confirm",
     "prompt": "A footer for a \"Delete project?\" confirmation with a Cancel action and a destructive Delete action."
    },
    {
     "id": "error-retry",
     "prompt": "An inline error message saying the payment failed, with a Retry action."
    },
    {
     "id": "status-row",
     "prompt": "A row of three status badges for a deployment — Healthy, Degraded and Down."
    },
    {
     "id": "close-icon",
     "prompt": "An icon-only close button for a side panel header."
    },
    {
     "id": "settings-row",
     "prompt": "A settings row with a heading, a short muted description and an on/off switch for email notifications."
    },
    {
     "id": "empty-state",
     "prompt": "An empty state for a project list — a heading, one sentence of muted text and a primary \"New project\" action."
    },
    {
     "id": "pricing-tabs",
     "prompt": "Tabs to switch a pricing table between Monthly and Yearly billing."
    },
    {
     "id": "api-key",
     "prompt": "A card that shows an API key in monospace with a Copy action and a warning that it is shown only once."
    },
    {
     "id": "filter-chips",
     "prompt": "A set of removable filter chips for \"Status - Open\", \"Owner - Me\" and \"Label - Bug\", with a Clear all link."
    },
    {
     "id": "usage-table",
     "prompt": "A small table of the last three invoices with date, amount and a status badge per row."
    }
   ],
   "conditions": [
    "baseline",
    "with_mcp"
   ],
   "grader": "blueprint-mcp lint (deterministic)",
   "ran": false
  }
 },
 "cases": [
  {
   "id": "neon-molecules",
   "team": "ciencia-lab",
   "title": "@neon.molecules: a science animation studio run by 11 agents",
   "summary": "Animated 60–90 second explainers about the chemistry of everyday life, researched, fact-checked, voiced, animated, scored and mixed by a team of agents.",
   "problem": "A good science short needs a researcher, a scriptwriter, a fact-checker, a narrator, an animator, a composer and a sound engineer. One person can't do all of that every few days without cutting corners on accuracy — the one thing a science account can't afford.",
   "approach": [
    "11 Experts in a fixed pipeline: sourced brief → beat-by-beat script → fact-check → narration → animation and music in parallel → mix → QA.",
    "Two human gates: the script is approved before any money is spent on voice or render, and the final video before upload.",
    "ElevenLabs (via MCP) for narration with word timings, music and effects; Manim for real molecular animation; ffmpeg for a −14 LUFS mix.",
    "Evals check every episode: loudness, length, fact-check on file and the number of cited sources."
   ],
   "lessons": [
    "Almost every view comes from non-followers, so the first seconds do all the work — retention on the best-measured episode is about 50% at 5 seconds, which is why the hook is now an eval.",
    "Evals flagged two published episodes with fewer than three cited sources — the kind of gap that is easy to miss by hand.",
    "Every measured episode hit the −14 LUFS loudness target and the 61–90 second window."
   ],
   "next": "Publish on YouTube Shorts and TikTok with the same pipeline, and turn on the LLM judge for hooks.",
   "metrics": {
    "episodes": 10,
    "published": 8,
    "first_published": "2026-10-29",
    "measured": 5,
    "views": 8020,
    "shares": 63,
    "saves": 51,
    "follows": 12,
    "avg_duration_s": 81.4,
    "best": {
     "episode": "body odor",
     "views": 2592,
     "shares": 18
    },
    "per_episode": [
     {
      "episode": "body odor",
      "date": "2026-10-29",
      "views": 2592,
      "shares": 18,
      "saves": 16
     },
     {
      "episode": "caffeine",
      "date": "2026-10-29",
      "views": 2057,
      "shares": 26,
      "saves": 23
     },
     {
      "episode": "onion",
      "date": "2026-10-31",
      "views": 1536,
      "shares": 17,
      "saves": 5
     },
     {
      "episode": "penicillin",
      "date": "2026-10-30",
      "views": 1650,
      "shares": 2,
      "saves": 7
     },
     {
      "episode": "spicy",
      "date": "2026-10-30",
      "views": 185,
      "shares": 0,
      "saves": null
     }
    ]
   }
  },
  {
   "id": "ofertasradar",
   "team": "ofertasradar",
   "title": "Ofertas Radar MX: a one-person deals media brand run by 13 agents",
   "summary": "An affiliate deals account on Instagram, Telegram, WhatsApp and the web, where agents find, verify, design and publish real discounts and a human approves every post.",
   "problem": "Running a deals account alone means hours a day finding real discounts, checking every price on the seller's page, designing posts for four channels and keeping each claim honest and labeled as advertising. Done by hand, quality slips exactly where trust is built.",
   "approach": [
    "13 Experts split the day: a Price Watcher rechecks yesterday's posts, the Deal Hunter verifies today's deals, designers and copywriters work in parallel, and Ad Compliance reviews before a human sees anything.",
    "Two scheduled editions (05:00 and 20:00) plus an event-driven flow when a follower asks for a product.",
    "One human approval gate before publishing; posts go out in order Telegram → WhatsApp → website → Instagram.",
    "Evals grade every published caption and deal, so a skill change that breaks a rule shows up as a dropping score."
   ],
   "lessons": [
    "Evals made the early gaps visible: deals with a tracked link per channel went from 35% in week one to 100% by week three, and deals with a verified source page from 70% to 100%.",
    "On the days measured per channel, clicks came almost entirely from Instagram; Telegram and WhatsApp bring far fewer, although WhatsApp produced the first sale from an owned channel.",
    "Compliance rules held at 100%: every scored caption carries #publicidad and a dated “prices may change” footer."
   ],
   "next": "Goal before Buen Fin (13 Nov 2026): 100 clicks and 3 sales in a month, with the channel experiment running one variable at a time.",
   "metrics": {
    "since": "2026-10-22",
    "until": "2026-11-07",
    "active_days": 15,
    "batches": 38,
    "deals": 328,
    "ig_feed_posts": 32,
    "ig_captions_scored": 38,
    "avg_discount": 45,
    "max_discount": 75,
    "affiliate": [
     {
      "period": "1–26 oct",
      "clicks": 165,
      "sales": 3
     },
     {
      "period": "1–6 nov",
      "clicks": 55,
      "sales": 0
     }
    ]
   }
  }
 ],
 "sessions": [
  {
   "id": "e53ac28c8f",
   "orchestration": "dev-loop",
   "trigger": "build",
   "engine": "mock",
   "status": "completed",
   "created_at": "2026-11-08T21:03:22+00:00",
   "updated_at": "2026-11-08T21:20:44+00:00",
   "total_steps": 12,
   "done_steps": 12,
   "duration_s": 99.0,
   "cost_usd": 0.08
  },
  {
   "id": "72228888dd",
   "orchestration": "dev-loop",
   "trigger": "spec",
   "engine": "mock",
   "status": "completed",
   "created_at": "2026-11-08T21:02:43+00:00",
   "updated_at": "2026-11-08T21:02:43+00:00",
   "total_steps": 3,
   "done_steps": 3,
   "duration_s": 184.4,
   "cost_usd": 0.1049
  },
  {
   "id": "d529b14066",
   "orchestration": "ofertasradar",
   "trigger": "peticion",
   "engine": "mock",
   "status": "awaiting_approval",
   "created_at": "2026-11-07T22:35:39+00:00",
   "updated_at": "2026-11-07T22:35:39+00:00",
   "total_steps": 2,
   "done_steps": 1,
   "duration_s": 144.3,
   "cost_usd": 0.0869
  },
  {
   "id": "2ee5e8e9c5",
   "orchestration": "ofertasradar",
   "trigger": "cierre",
   "engine": "mock",
   "status": "completed",
   "created_at": "2026-11-07T22:35:39+00:00",
   "updated_at": "2026-11-07T22:35:39+00:00",
   "total_steps": 2,
   "done_steps": 2,
   "duration_s": 169.6,
   "cost_usd": 0.5014
  },
  {
   "id": "a0e757c1bf",
   "orchestration": "ofertasradar",
   "trigger": "noche",
   "engine": "mock",
   "status": "completed",
   "created_at": "2026-11-07T22:35:39+00:00",
   "updated_at": "2026-11-07T22:35:39+00:00",
   "total_steps": 8,
   "done_steps": 8,
   "duration_s": 919.1,
   "cost_usd": 1.5631
  },
  {
   "id": "0c93684e6a",
   "orchestration": "ofertasradar",
   "trigger": "dia",
   "engine": "mock",
   "status": "awaiting_approval",
   "created_at": "2026-11-07T22:35:39+00:00",
   "updated_at": "2026-11-07T22:35:39+00:00",
   "total_steps": 11,
   "done_steps": 8,
   "duration_s": 1426.1000000000001,
   "cost_usd": 1.3344
  },
  {
   "id": "c28bb377a8",
   "orchestration": "elitro-lab",
   "trigger": "nocturno",
   "engine": "mock",
   "status": "completed",
   "created_at": "2026-11-07T22:35:39+00:00",
   "updated_at": "2026-11-07T22:35:39+00:00",
   "total_steps": 3,
   "done_steps": 3,
   "duration_s": 247.5,
   "cost_usd": 0.3987
  },
  {
   "id": "e8c0a1ae2d",
   "orchestration": "elitro-lab",
   "trigger": "bug",
   "engine": "mock",
   "status": "completed",
   "created_at": "2026-11-07T22:35:39+00:00",
   "updated_at": "2026-11-07T22:35:39+00:00",
   "total_steps": 1,
   "done_steps": 1,
   "duration_s": 136.7,
   "cost_usd": 0.0499
  },
  {
   "id": "7c52dbe9d6",
   "orchestration": "elitro-lab",
   "trigger": "ciclo",
   "engine": "mock",
   "status": "awaiting_approval",
   "created_at": "2026-11-07T22:35:38+00:00",
   "updated_at": "2026-11-07T22:35:39+00:00",
   "total_steps": 13,
   "done_steps": 11,
   "duration_s": 1300.4,
   "cost_usd": 2.4682
  },
  {
   "id": "24bd10d487",
   "orchestration": "ciencia-lab",
   "trigger": "semanal",
   "engine": "mock",
   "status": "completed",
   "created_at": "2026-11-07T22:35:38+00:00",
   "updated_at": "2026-11-07T22:35:38+00:00",
   "total_steps": 1,
   "done_steps": 1,
   "duration_s": 26.4,
   "cost_usd": 0.1902
  },
  {
   "id": "ff9c748216",
   "orchestration": "ciencia-lab",
   "trigger": "episodio",
   "engine": "mock",
   "status": "awaiting_approval",
   "created_at": "2026-11-07T22:35:38+00:00",
   "updated_at": "2026-11-07T22:35:38+00:00",
   "total_steps": 12,
   "done_steps": 10,
   "duration_s": 833.6,
   "cost_usd": 1.7904
  }
 ],
 "session_details": {
  "e53ac28c8f": {
   "id": "e53ac28c8f",
   "orchestration": "dev-loop",
   "trigger": "build",
   "engine": "mock",
   "status": "completed",
   "payload": {
    "slug": "capitalize",
    "title": "Add a capitalize helper",
    "repo": "a private repo",
    "labels": [
     "enhancement"
    ],
    "budget_usd": 2.0,
    "mock": "fail-once",
    "issue": 1,
    "branch": "forge/1-capitalize",
    "base": "main",
    "pr": 2,
    "review_verdict": "approve",
    "review_rounds": 1
   },
   "created_at": "2026-11-08T21:03:22+00:00",
   "updated_at": "2026-11-08T21:20:44+00:00",
   "steps": [
    {
     "session_id": "e53ac28c8f",
     "step_id": "workspace",
     "expert": null,
     "status": "done",
     "output": "Worktree on forge/1-capitalize (from main)",
     "duration_s": 0.0,
     "cost_usd": 0.0,
     "started_at": "2026-11-08T21:03:22+00:00",
     "finished_at": "2026-11-08T21:03:26+00:00"
    },
    {
     "session_id": "e53ac28c8f",
     "step_id": "note_building",
     "expert": null,
     "status": "done",
     "output": "Note updated: {'status': 'building'}",
     "duration_s": 0.0,
     "cost_usd": 0.0,
     "started_at": "2026-11-08T21:03:26+00:00",
     "finished_at": "2026-11-08T21:03:26+00:00"
    },
    {
     "session_id": "e53ac28c8f",
     "step_id": "implement",
     "expert": "implementer",
     "status": "done",
     "output": "Implementer edited src/capitalize.js. Module and test written.\n✓ npm run verify",
     "duration_s": 84.0,
     "cost_usd": 0.06,
     "started_at": "2026-11-08T21:03:26+00:00",
     "finished_at": "2026-11-08T21:03:41+00:00"
    },
    {
     "session_id": "e53ac28c8f",
     "step_id": "push",
     "expert": null,
     "status": "done",
     "output": "Pushed forge/1-capitalize",
     "duration_s": 0.0,
     "cost_usd": 0.0,
     "started_at": "2026-11-08T21:03:41+00:00",
     "finished_at": "2026-11-08T21:03:43+00:00"
    },
    {
     "session_id": "e53ac28c8f",
     "step_id": "open_pr",
     "expert": null,
     "status": "done",
     "output": "Opened pull request #2 from forge/1-capitalize",
     "duration_s": 0.0,
     "cost_usd": 0.0,
     "started_at": "2026-11-08T21:03:43+00:00",
     "finished_at": "2026-11-08T21:03:45+00:00"
    },
    {
     "session_id": "e53ac28c8f",
     "step_id": "review",
     "expert": "reviewer",
     "status": "done",
     "output": "VERDICT: approve\n- Small, tested change; lint and tests pass in the container.",
     "duration_s": 15.0,
     "cost_usd": 0.02,
     "started_at": "2026-11-08T21:03:45+00:00",
     "finished_at": "2026-11-08T21:03:45+00:00"
    },
    {
     "session_id": "e53ac28c8f",
     "step_id": "comment_review",
     "expert": null,
     "status": "done",
     "output": "Commented on #2",
     "duration_s": 0.0,
     "cost_usd": 0.0,
     "started_at": "2026-11-08T21:03:45+00:00",
     "finished_at": "2026-11-08T21:03:45+00:00"
    },
    {
     "session_id": "e53ac28c8f",
     "step_id": "ready_for_human",
     "expert": null,
     "status": "done",
     "output": "#2: +['forge:human-review'] −[]",
     "duration_s": 0.0,
     "cost_usd": 0.0,
     "started_at": "2026-11-08T21:03:45+00:00",
     "finished_at": "2026-11-08T21:03:47+00:00"
    },
    {
     "session_id": "e53ac28c8f",
     "step_id": "note_review",
     "expert": null,
     "status": "done",
     "output": "Note updated: {'status': 'review', 'pr': 2}",
     "duration_s": 0.0,
     "cost_usd": 0.0,
     "started_at": "2026-11-08T21:03:47+00:00",
     "finished_at": "2026-11-08T21:03:47+00:00"
    },
    {
     "session_id": "e53ac28c8f",
     "step_id": "human_review",
     "expert": null,
     "status": "done",
     "output": "Approved by GitHub merge. PR #2 merged",
     "duration_s": 0.0,
     "cost_usd": null,
     "started_at": "2026-11-08T21:03:47+00:00",
     "finished_at": "2026-11-08T21:20:44+00:00"
    },
    {
     "session_id": "e53ac28c8f",
     "step_id": "note_done",
     "expert": null,
     "status": "done",
     "output": "Note updated: {'status': 'done'}",
     "duration_s": 0.0,
     "cost_usd": 0.0,
     "started_at": "2026-11-08T21:20:44+00:00",
     "finished_at": "2026-11-08T21:20:44+00:00"
    },
    {
     "session_id": "e53ac28c8f",
     "step_id": "cleanup",
     "expert": null,
     "status": "done",
     "output": "Worktree removed",
     "duration_s": 0.0,
     "cost_usd": 0.0,
     "started_at": "2026-11-08T21:20:44+00:00",
     "finished_at": "2026-11-08T21:20:44+00:00"
    }
   ],
   "events": [
    {
     "ts": "2026-11-08T21:03:22+00:00",
     "kind": "session",
     "step_id": null,
     "message": "Session started by build with the mock engine"
    },
    {
     "ts": "2026-11-08T21:03:26+00:00",
     "kind": "action",
     "step_id": "workspace",
     "message": "workspace.create: Worktree on forge/1-capitalize (from main)"
    },
    {
     "ts": "2026-11-08T21:03:26+00:00",
     "kind": "action",
     "step_id": "note_building",
     "message": "vault.update: Note updated: {'status': 'building'}"
    },
    {
     "ts": "2026-11-08T21:03:26+00:00",
     "kind": "step",
     "step_id": "implement",
     "message": "Implementer started \"Implement the issue\""
    },
    {
     "ts": "2026-11-08T21:03:36+00:00",
     "kind": "hook",
     "step_id": "implement",
     "message": "after: npm run verify → exit 1"
    },
    {
     "ts": "2026-11-08T21:03:36+00:00",
     "kind": "retry",
     "step_id": "implement",
     "message": "Attempt 1 failed npm run verify; trying again"
    },
    {
     "ts": "2026-11-08T21:03:41+00:00",
     "kind": "hook",
     "step_id": "implement",
     "message": "after: npm run verify → exit 0"
    },
    {
     "ts": "2026-11-08T21:03:41+00:00",
     "kind": "step",
     "step_id": "implement",
     "message": "Implementer finished \"Implement the issue\" in 84.0s"
    },
    {
     "ts": "2026-11-08T21:03:43+00:00",
     "kind": "action",
     "step_id": "push",
     "message": "workspace.push: Pushed forge/1-capitalize"
    },
    {
     "ts": "2026-11-08T21:03:45+00:00",
     "kind": "action",
     "step_id": "open_pr",
     "message": "github.open_pr: Opened pull request #2 from forge/1-capitalize"
    },
    {
     "ts": "2026-11-08T21:03:45+00:00",
     "kind": "step",
     "step_id": "review",
     "message": "Reviewer started \"Review the pull request\""
    },
    {
     "ts": "2026-11-08T21:03:45+00:00",
     "kind": "step",
     "step_id": "review",
     "message": "Reviewer finished \"Review the pull request\" in 15.0s"
    },
    {
     "ts": "2026-11-08T21:03:45+00:00",
     "kind": "review",
     "step_id": "review",
     "message": "Round 1: approve"
    },
    {
     "ts": "2026-11-08T21:03:45+00:00",
     "kind": "action",
     "step_id": "comment_review",
     "message": "github.comment: Commented on #2"
    },
    {
     "ts": "2026-11-08T21:03:47+00:00",
     "kind": "action",
     "step_id": "ready_for_human",
     "message": "github.label: #2: +['forge:human-review'] −[]"
    },
    {
     "ts": "2026-11-08T21:03:47+00:00",
     "kind": "action",
     "step_id": "note_review",
     "message": "vault.update: Note updated: {'status': 'review', 'pr': 2}"
    },
    {
     "ts": "2026-11-08T21:03:47+00:00",
     "kind": "gate",
     "step_id": "human_review",
     "message": "Awaiting approval: Human review and merge"
    },
    {
     "ts": "2026-11-08T21:20:44+00:00",
     "kind": "approval",
     "step_id": "human_review",
     "message": "Approved by GitHub merge"
    },
    {
     "ts": "2026-11-08T21:20:44+00:00",
     "kind": "action",
     "step_id": "note_done",
     "message": "vault.update: Note updated: {'status': 'done'}"
    },
    {
     "ts": "2026-11-08T21:20:44+00:00",
     "kind": "action",
     "step_id": "cleanup",
     "message": "workspace.remove: Worktree removed"
    },
    {
     "ts": "2026-11-08T21:20:44+00:00",
     "kind": "session",
     "step_id": null,
     "message": "Session completed · 12 steps"
    }
   ]
  },
  "72228888dd": {
   "id": "72228888dd",
   "orchestration": "dev-loop",
   "trigger": "spec",
   "engine": "mock",
   "status": "completed",
   "payload": {
    "slug": "capitalize",
    "title": "Add a capitalize helper",
    "repo": "a private repo",
    "labels": [
     "enhancement"
    ],
    "budget_usd": 2.0,
    "mock": "fail-once",
    "issue": 1
   },
   "created_at": "2026-11-08T21:02:43+00:00",
   "updated_at": "2026-11-08T21:02:43+00:00",
   "steps": [
    {
     "session_id": "72228888dd",
     "step_id": "spec",
     "expert": "advisor",
     "status": "done",
     "output": "Advisor completed 'Draft the issue'.\nTask: Draft the issue\nContext received: 680 characters · simulated tokens: 11,660",
     "duration_s": 184.4,
     "cost_usd": 0.1049,
     "started_at": "2026-11-08T21:02:43+00:00",
     "finished_at": "2026-11-08T21:02:43+00:00"
    },
    {
     "session_id": "72228888dd",
     "step_id": "open_issue",
     "expert": null,
     "status": "done",
     "output": "Opened issue #1 in a private repo",
     "duration_s": 0.0,
     "cost_usd": 0.0,
     "started_at": "2026-11-08T21:02:43+00:00",
     "finished_at": "2026-11-08T21:02:43+00:00"
    },
    {
     "session_id": "72228888dd",
     "step_id": "note_spec",
     "expert": null,
     "status": "done",
     "output": "Note updated: {'status': 'spec', 'issue': 1}",
     "duration_s": 0.0,
     "cost_usd": 0.0,
     "started_at": "2026-11-08T21:02:43+00:00",
     "finished_at": "2026-11-08T21:02:43+00:00"
    }
   ],
   "events": [
    {
     "ts": "2026-11-08T21:02:43+00:00",
     "kind": "session",
     "step_id": null,
     "message": "Session started by spec with the mock engine"
    },
    {
     "ts": "2026-11-08T21:02:43+00:00",
     "kind": "step",
     "step_id": "spec",
     "message": "Advisor started \"Draft the issue\""
    },
    {
     "ts": "2026-11-08T21:02:43+00:00",
     "kind": "step",
     "step_id": "spec",
     "message": "Advisor finished \"Draft the issue\" in 184.4s"
    },
    {
     "ts": "2026-11-08T21:02:43+00:00",
     "kind": "action",
     "step_id": "open_issue",
     "message": "github.create_issue: Opened issue #1 in a private repo"
    },
    {
     "ts": "2026-11-08T21:02:43+00:00",
     "kind": "action",
     "step_id": "note_spec",
     "message": "vault.update: Note updated: {'status': 'spec', 'issue': 1}"
    },
    {
     "ts": "2026-11-08T21:02:43+00:00",
     "kind": "session",
     "step_id": null,
     "message": "Session completed · 3 steps"
    }
   ]
  },
  "d529b14066": {
   "id": "d529b14066",
   "orchestration": "ofertasradar",
   "trigger": "peticion",
   "engine": "mock",
   "status": "awaiting_approval",
   "payload": {
    "demo": true
   },
   "created_at": "2026-11-07T22:35:39+00:00",
   "updated_at": "2026-11-07T22:35:39+00:00",
   "steps": [
    {
     "session_id": "d529b14066",
     "step_id": "pedido",
     "expert": "peticiones",
     "status": "done",
     "output": "Request Finder completed 'Catalog for a follower'.\nTask: Find the requested product and 3–8 similar ones; deliver a dry-run catalog only.\nContext received: 604 characters · simulated tokens: 9,657",
     "duration_s": 144.3,
     "cost_usd": 0.0869,
     "started_at": "2026-11-07T22:35:39+00:00",
     "finished_at": "2026-11-07T22:35:39+00:00"
    },
    {
     "session_id": "d529b14066",
     "step_id": "aprobar_pedido",
     "expert": null,
     "status": "awaiting_approval",
     "output": null,
     "duration_s": null,
     "cost_usd": null,
     "started_at": "2026-11-07T22:35:39+00:00",
     "finished_at": null
    }
   ],
   "events": [
    {
     "ts": "2026-11-07T22:35:39+00:00",
     "kind": "session",
     "step_id": null,
     "message": "Session started by peticion with the mock engine"
    },
    {
     "ts": "2026-11-07T22:35:39+00:00",
     "kind": "step",
     "step_id": "pedido",
     "message": "Request Finder started \"Catalog for a follower\""
    },
    {
     "ts": "2026-11-07T22:35:39+00:00",
     "kind": "step",
     "step_id": "pedido",
     "message": "Request Finder finished \"Catalog for a follower\" in 144.3s"
    },
    {
     "ts": "2026-11-07T22:35:39+00:00",
     "kind": "memory",
     "step_id": "pedido",
     "message": "Request Finder: in \"Catalog for a follower\", validate the input before starting."
    },
    {
     "ts": "2026-11-07T22:35:39+00:00",
     "kind": "gate",
     "step_id": "aprobar_pedido",
     "message": "Awaiting approval: Approve reply to follower"
    }
   ]
  },
  "2ee5e8e9c5": {
   "id": "2ee5e8e9c5",
   "orchestration": "ofertasradar",
   "trigger": "cierre",
   "engine": "mock",
   "status": "completed",
   "payload": {
    "demo": true
   },
   "created_at": "2026-11-07T22:35:39+00:00",
   "updated_at": "2026-11-07T22:35:39+00:00",
   "steps": [
    {
     "session_id": "2ee5e8e9c5",
     "step_id": "metricas",
     "expert": "analista",
     "status": "done",
     "output": "Analyst completed 'Daily metrics'.\nTask: Daily metrics\nContext received: 440 characters · simulated tokens: 31,724",
     "duration_s": 133.1,
     "cost_usd": 0.2855,
     "started_at": "2026-11-07T22:35:39+00:00",
     "finished_at": "2026-11-07T22:35:39+00:00"
    },
    {
     "session_id": "2ee5e8e9c5",
     "step_id": "limpiar",
     "expert": "janitor",
     "status": "done",
     "output": "Janitor completed 'Repo cleanup'.\nTask: Repo cleanup\nContext received: 439 characters · simulated tokens: 23,992",
     "duration_s": 36.5,
     "cost_usd": 0.2159,
     "started_at": "2026-11-07T22:35:39+00:00",
     "finished_at": "2026-11-07T22:35:39+00:00"
    }
   ],
   "events": [
    {
     "ts": "2026-11-07T22:35:39+00:00",
     "kind": "session",
     "step_id": null,
     "message": "Session started by cierre with the mock engine"
    },
    {
     "ts": "2026-11-07T22:35:39+00:00",
     "kind": "step",
     "step_id": "metricas",
     "message": "Analyst started \"Daily metrics\""
    },
    {
     "ts": "2026-11-07T22:35:39+00:00",
     "kind": "step",
     "step_id": "limpiar",
     "message": "Janitor started \"Repo cleanup\""
    },
    {
     "ts": "2026-11-07T22:35:39+00:00",
     "kind": "step",
     "step_id": "limpiar",
     "message": "Janitor finished \"Repo cleanup\" in 36.5s"
    },
    {
     "ts": "2026-11-07T22:35:39+00:00",
     "kind": "step",
     "step_id": "metricas",
     "message": "Analyst finished \"Daily metrics\" in 133.1s"
    },
    {
     "ts": "2026-11-07T22:35:39+00:00",
     "kind": "session",
     "step_id": null,
     "message": "Session completed · 2 steps"
    }
   ]
  },
  "a0e757c1bf": {
   "id": "a0e757c1bf",
   "orchestration": "ofertasradar",
   "trigger": "noche",
   "engine": "mock",
   "status": "completed",
   "payload": {
    "demo": true
   },
   "created_at": "2026-11-07T22:35:39+00:00",
   "updated_at": "2026-11-07T22:35:39+00:00",
   "steps": [
    {
     "session_id": "a0e757c1bf",
     "step_id": "plan",
     "expert": "ceo",
     "status": "done",
     "output": "CEO completed 'Plan the day'.\nTask: Set the theme, beauty topic, engagement format, channel to promote and the experiment of the day.\nContext received: 466 characters · simulated tokens: 38,411",
     "duration_s": 213.2,
     "cost_usd": 0.3457,
     "started_at": "2026-11-07T22:35:39+00:00",
     "finished_at": "2026-11-07T22:35:39+00:00"
    },
    {
     "session_id": "a0e757c1bf",
     "step_id": "cazar",
     "expert": "cazador",
     "status": "done",
     "output": "Deal Hunter completed 'Find & verify deals'.\nTask: Find the mega deal, beauty, themed deals and pending requests; verify every price today.\nContext received: 686 characters · simulated tokens: 35,499",
     "duration_s": 167.5,
     "cost_usd": 0.3195,
     "started_at": "2026-11-07T22:35:39+00:00",
     "finished_at": "2026-11-07T22:35:39+00:00"
    },
    {
     "session_id": "a0e757c1bf",
     "step_id": "disenar",
     "expert": "diseno",
     "status": "done",
     "output": "Post Designer completed 'Design posts & stories'.\nTask: Design posts & stories\nContext received: 612 characters · simulated tokens: 26,247",
     "duration_s": 113.4,
     "cost_usd": 0.2362,
     "started_at": "2026-11-07T22:35:39+00:00",
     "finished_at": "2026-11-07T22:35:39+00:00"
    },
    {
     "session_id": "a0e757c1bf",
     "step_id": "redactar",
     "expert": "copy",
     "status": "done",
     "output": "Copywriter completed 'Write captions'.\nTask: Write captions\nContext received: 604 characters · simulated tokens: 9,410",
     "duration_s": 43.6,
     "cost_usd": 0.0847,
     "started_at": "2026-11-07T22:35:39+00:00",
     "finished_at": "2026-11-07T22:35:39+00:00"
    },
    {
     "session_id": "a0e757c1bf",
     "step_id": "revisar",
     "expert": "cumplimiento",
     "status": "done",
     "output": "Ad Compliance completed 'Compliance review'.\nTask: Compliance review\nContext received: 698 characters · simulated tokens: 13,818",
     "duration_s": 106.7,
     "cost_usd": 0.1244,
     "started_at": "2026-11-07T22:35:39+00:00",
     "finished_at": "2026-11-07T22:35:39+00:00"
    },
    {
     "session_id": "a0e757c1bf",
     "step_id": "aprobar",
     "expert": null,
     "status": "done",
     "output": "Approved by owner. Looks good",
     "duration_s": 0.0,
     "cost_usd": null,
     "started_at": "2026-11-07T22:35:39+00:00",
     "finished_at": "2026-11-07T22:35:39+00:00"
    },
    {
     "session_id": "a0e757c1bf",
     "step_id": "publicar",
     "expert": "publicador",
     "status": "done",
     "output": "Publisher completed 'Publish to channels'.\nTask: Publish to channels\nContext received: 444 characters · simulated tokens: 15,261",
     "duration_s": 84.7,
     "cost_usd": 0.1373,
     "started_at": "2026-11-07T22:35:39+00:00",
     "finished_at": "2026-11-07T22:35:39+00:00"
    },
    {
     "session_id": "a0e757c1bf",
     "step_id": "pagina",
     "expert": "web",
     "status": "done",
     "output": "Web Expert completed 'Update website'.\nTask: Update website\nContext received: 533 characters · simulated tokens: 35,030",
     "duration_s": 190.0,
     "cost_usd": 0.3153,
     "started_at": "2026-11-07T22:35:39+00:00",
     "finished_at": "2026-11-07T22:35:39+00:00"
    }
   ],
   "events": [
    {
     "ts": "2026-11-07T22:35:39+00:00",
     "kind": "session",
     "step_id": null,
     "message": "Session started by noche with the mock engine"
    },
    {
     "ts": "2026-11-07T22:35:39+00:00",
     "kind": "step",
     "step_id": "plan",
     "message": "CEO started \"Plan the day\""
    },
    {
     "ts": "2026-11-07T22:35:39+00:00",
     "kind": "step",
     "step_id": "plan",
     "message": "CEO finished \"Plan the day\" in 213.2s"
    },
    {
     "ts": "2026-11-07T22:35:39+00:00",
     "kind": "step",
     "step_id": "cazar",
     "message": "Deal Hunter started \"Find & verify deals\""
    },
    {
     "ts": "2026-11-07T22:35:39+00:00",
     "kind": "step",
     "step_id": "cazar",
     "message": "Deal Hunter finished \"Find & verify deals\" in 167.5s"
    },
    {
     "ts": "2026-11-07T22:35:39+00:00",
     "kind": "step",
     "step_id": "disenar",
     "message": "Post Designer started \"Design posts & stories\""
    },
    {
     "ts": "2026-11-07T22:35:39+00:00",
     "kind": "step",
     "step_id": "redactar",
     "message": "Copywriter started \"Write captions\""
    },
    {
     "ts": "2026-11-07T22:35:39+00:00",
     "kind": "step",
     "step_id": "disenar",
     "message": "Post Designer finished \"Design posts & stories\" in 113.4s"
    },
    {
     "ts": "2026-11-07T22:35:39+00:00",
     "kind": "step",
     "step_id": "redactar",
     "message": "Copywriter finished \"Write captions\" in 43.6s"
    },
    {
     "ts": "2026-11-07T22:35:39+00:00",
     "kind": "step",
     "step_id": "revisar",
     "message": "Ad Compliance started \"Compliance review\""
    },
    {
     "ts": "2026-11-07T22:35:39+00:00",
     "kind": "step",
     "step_id": "revisar",
     "message": "Ad Compliance finished \"Compliance review\" in 106.7s"
    },
    {
     "ts": "2026-11-07T22:35:39+00:00",
     "kind": "gate",
     "step_id": "aprobar",
     "message": "Awaiting approval: Preview & owner approval"
    },
    {
     "ts": "2026-11-07T22:35:39+00:00",
     "kind": "approval",
     "step_id": "aprobar",
     "message": "Approved by owner"
    },
    {
     "ts": "2026-11-07T22:35:39+00:00",
     "kind": "step",
     "step_id": "publicar",
     "message": "Publisher started \"Publish to channels\""
    },
    {
     "ts": "2026-11-07T22:35:39+00:00",
     "kind": "step",
     "step_id": "publicar",
     "message": "Publisher finished \"Publish to channels\" in 84.7s"
    },
    {
     "ts": "2026-11-07T22:35:39+00:00",
     "kind": "step",
     "step_id": "pagina",
     "message": "Web Expert started \"Update website\""
    },
    {
     "ts": "2026-11-07T22:35:39+00:00",
     "kind": "step",
     "step_id": "pagina",
     "message": "Web Expert finished \"Update website\" in 190.0s"
    },
    {
     "ts": "2026-11-07T22:35:39+00:00",
     "kind": "session",
     "step_id": null,
     "message": "Session completed · 8 steps"
    }
   ]
  },
  "0c93684e6a": {
   "id": "0c93684e6a",
   "orchestration": "ofertasradar",
   "trigger": "dia",
   "engine": "mock",
   "status": "awaiting_approval",
   "payload": {
    "demo": true
   },
   "created_at": "2026-11-07T22:35:39+00:00",
   "updated_at": "2026-11-07T22:35:39+00:00",
   "steps": [
    {
     "session_id": "0c93684e6a",
     "step_id": "vigilar",
     "expert": "vigilante",
     "status": "done",
     "output": "Price Watcher completed 'Recheck published deals'.\nTask: Review the deals published yesterday and update prices that changed.\nContext received: 152 characters · simulated tokens: 12,638",
     "duration_s": 156.8,
     "cost_usd": 0.1137,
     "started_at": "2026-11-07T22:35:39+00:00",
     "finished_at": "2026-11-07T22:35:39+00:00"
    },
    {
     "session_id": "0c93684e6a",
     "step_id": "plan",
     "expert": "ceo",
     "status": "done",
     "output": "CEO completed 'Plan the day'.\nTask: Set the theme, beauty topic, engagement format, channel to promote and the experiment of the day.\nContext received: 520 characters · simulated tokens: 4,086",
     "duration_s": 204.8,
     "cost_usd": 0.0368,
     "started_at": "2026-11-07T22:35:39+00:00",
     "finished_at": "2026-11-07T22:35:39+00:00"
    },
    {
     "session_id": "0c93684e6a",
     "step_id": "cazar",
     "expert": "cazador",
     "status": "done",
     "output": "Deal Hunter completed 'Find & verify deals'.\nTask: Find the mega deal, beauty, themed deals and pending requests; verify every price today.\nContext received: 595 characters · simulated tokens: 18,227",
     "duration_s": 95.7,
     "cost_usd": 0.164,
     "started_at": "2026-11-07T22:35:39+00:00",
     "finished_at": "2026-11-07T22:35:39+00:00"
    },
    {
     "session_id": "0c93684e6a",
     "step_id": "engagement",
     "expert": "social",
     "status": "done",
     "output": "Social Media Manager completed 'Engagement post'.\nTask: Engagement post\nContext received: 501 characters · simulated tokens: 17,584",
     "duration_s": 238.9,
     "cost_usd": 0.1583,
     "started_at": "2026-11-07T22:35:39+00:00",
     "finished_at": "2026-11-07T22:35:39+00:00"
    },
    {
     "session_id": "0c93684e6a",
     "step_id": "disenar",
     "expert": "diseno",
     "status": "done",
     "output": "Post Designer completed 'Design posts & stories'.\nTask: Design posts & stories\nContext received: 522 characters · simulated tokens: 31,230",
     "duration_s": 142.6,
     "cost_usd": 0.2811,
     "started_at": "2026-11-07T22:35:39+00:00",
     "finished_at": "2026-11-07T22:35:39+00:00"
    },
    {
     "session_id": "0c93684e6a",
     "step_id": "redactar",
     "expert": "copy",
     "status": "done",
     "output": "Copywriter completed 'Write captions'.\nTask: Write captions\nContext received: 514 characters · simulated tokens: 17,786",
     "duration_s": 233.4,
     "cost_usd": 0.1601,
     "started_at": "2026-11-07T22:35:39+00:00",
     "finished_at": "2026-11-07T22:35:39+00:00"
    },
    {
     "session_id": "0c93684e6a",
     "step_id": "video",
     "expert": "video",
     "status": "done",
     "output": "Video Editor completed 'Edit video'.\nTask: Edit video\nContext received: 510 characters · simulated tokens: 23,351",
     "duration_s": 223.3,
     "cost_usd": 0.2102,
     "started_at": "2026-11-07T22:35:39+00:00",
     "finished_at": "2026-11-07T22:35:39+00:00"
    },
    {
     "session_id": "0c93684e6a",
     "step_id": "revisar",
     "expert": "cumplimiento",
     "status": "done",
     "output": "Ad Compliance completed 'Compliance review'.\nTask: Compliance review\nContext received: 1,002 characters · simulated tokens: 23,351",
     "duration_s": 130.6,
     "cost_usd": 0.2102,
     "started_at": "2026-11-07T22:35:39+00:00",
     "finished_at": "2026-11-07T22:35:39+00:00"
    },
    {
     "session_id": "0c93684e6a",
     "step_id": "aprobar",
     "expert": null,
     "status": "awaiting_approval",
     "output": null,
     "duration_s": null,
     "cost_usd": null,
     "started_at": "2026-11-07T22:35:39+00:00",
     "finished_at": null
    },
    {
     "session_id": "0c93684e6a",
     "step_id": "publicar",
     "expert": "publicador",
     "status": "pending",
     "output": null,
     "duration_s": null,
     "cost_usd": null,
     "started_at": null,
     "finished_at": null
    },
    {
     "session_id": "0c93684e6a",
     "step_id": "pagina",
     "expert": "web",
     "status": "pending",
     "output": null,
     "duration_s": null,
     "cost_usd": null,
     "started_at": null,
     "finished_at": null
    }
   ],
   "events": [
    {
     "ts": "2026-11-07T22:35:39+00:00",
     "kind": "session",
     "step_id": null,
     "message": "Session started by dia with the mock engine"
    },
    {
     "ts": "2026-11-07T22:35:39+00:00",
     "kind": "step",
     "step_id": "vigilar",
     "message": "Price Watcher started \"Recheck published deals\""
    },
    {
     "ts": "2026-11-07T22:35:39+00:00",
     "kind": "step",
     "step_id": "vigilar",
     "message": "Price Watcher finished \"Recheck published deals\" in 156.8s"
    },
    {
     "ts": "2026-11-07T22:35:39+00:00",
     "kind": "memory",
     "step_id": "vigilar",
     "message": "Price Watcher: in \"Recheck published deals\", validate the input before starting."
    },
    {
     "ts": "2026-11-07T22:35:39+00:00",
     "kind": "step",
     "step_id": "plan",
     "message": "CEO started \"Plan the day\""
    },
    {
     "ts": "2026-11-07T22:35:39+00:00",
     "kind": "step",
     "step_id": "plan",
     "message": "CEO finished \"Plan the day\" in 204.8s"
    },
    {
     "ts": "2026-11-07T22:35:39+00:00",
     "kind": "memory",
     "step_id": "plan",
     "message": "CEO: in \"Plan the day\", validate the input before starting."
    },
    {
     "ts": "2026-11-07T22:35:39+00:00",
     "kind": "step",
     "step_id": "cazar",
     "message": "Deal Hunter started \"Find & verify deals\""
    },
    {
     "ts": "2026-11-07T22:35:39+00:00",
     "kind": "step",
     "step_id": "engagement",
     "message": "Social Media Manager started \"Engagement post\""
    },
    {
     "ts": "2026-11-07T22:35:39+00:00",
     "kind": "step",
     "step_id": "cazar",
     "message": "Deal Hunter finished \"Find & verify deals\" in 95.7s"
    },
    {
     "ts": "2026-11-07T22:35:39+00:00",
     "kind": "step",
     "step_id": "engagement",
     "message": "Social Media Manager finished \"Engagement post\" in 238.9s"
    },
    {
     "ts": "2026-11-07T22:35:39+00:00",
     "kind": "step",
     "step_id": "disenar",
     "message": "Post Designer started \"Design posts & stories\""
    },
    {
     "ts": "2026-11-07T22:35:39+00:00",
     "kind": "step",
     "step_id": "redactar",
     "message": "Copywriter started \"Write captions\""
    },
    {
     "ts": "2026-11-07T22:35:39+00:00",
     "kind": "step",
     "step_id": "video",
     "message": "Video Editor started \"Edit video\""
    },
    {
     "ts": "2026-11-07T22:35:39+00:00",
     "kind": "step",
     "step_id": "video",
     "message": "Video Editor finished \"Edit video\" in 223.3s"
    },
    {
     "ts": "2026-11-07T22:35:39+00:00",
     "kind": "step",
     "step_id": "disenar",
     "message": "Post Designer finished \"Design posts & stories\" in 142.6s"
    },
    {
     "ts": "2026-11-07T22:35:39+00:00",
     "kind": "step",
     "step_id": "redactar",
     "message": "Copywriter finished \"Write captions\" in 233.4s"
    },
    {
     "ts": "2026-11-07T22:35:39+00:00",
     "kind": "memory",
     "step_id": "redactar",
     "message": "Copywriter: in \"Write captions\", validate the input before starting."
    },
    {
     "ts": "2026-11-07T22:35:39+00:00",
     "kind": "step",
     "step_id": "revisar",
     "message": "Ad Compliance started \"Compliance review\""
    },
    {
     "ts": "2026-11-07T22:35:39+00:00",
     "kind": "step",
     "step_id": "revisar",
     "message": "Ad Compliance finished \"Compliance review\" in 130.6s"
    },
    {
     "ts": "2026-11-07T22:35:39+00:00",
     "kind": "gate",
     "step_id": "aprobar",
     "message": "Awaiting approval: Preview & owner approval"
    }
   ]
  },
  "c28bb377a8": {
   "id": "c28bb377a8",
   "orchestration": "elitro-lab",
   "trigger": "nocturno",
   "engine": "mock",
   "status": "completed",
   "payload": {
    "demo": true
   },
   "created_at": "2026-11-07T22:35:39+00:00",
   "updated_at": "2026-11-07T22:35:39+00:00",
   "steps": [
    {
     "session_id": "c28bb377a8",
     "step_id": "simular",
     "expert": "balance",
     "status": "done",
     "output": "Balance completed 'Balance simulations'.\nTask: Balance simulations\nContext received: 171 characters · simulated tokens: 10,492",
     "duration_s": 29.9,
     "cost_usd": 0.0944,
     "started_at": "2026-11-07T22:35:39+00:00",
     "finished_at": "2026-11-07T22:35:39+00:00"
    },
    {
     "session_id": "c28bb377a8",
     "step_id": "ok_version",
     "expert": null,
     "status": "done",
     "output": "Approved by owner. Looks good",
     "duration_s": 0.0,
     "cost_usd": null,
     "started_at": "2026-11-07T22:35:39+00:00",
     "finished_at": "2026-11-07T22:35:39+00:00"
    },
    {
     "session_id": "c28bb377a8",
     "step_id": "publicar",
     "expert": "director",
     "status": "done",
     "output": "Director completed 'Ship the release'.\nTask: Ship the release\nContext received: 233 characters · simulated tokens: 33,811",
     "duration_s": 217.6,
     "cost_usd": 0.3043,
     "started_at": "2026-11-07T22:35:39+00:00",
     "finished_at": "2026-11-07T22:35:39+00:00"
    }
   ],
   "events": [
    {
     "ts": "2026-11-07T22:35:39+00:00",
     "kind": "session",
     "step_id": null,
     "message": "Session started by nocturno with the mock engine"
    },
    {
     "ts": "2026-11-07T22:35:39+00:00",
     "kind": "step",
     "step_id": "simular",
     "message": "Balance started \"Balance simulations\""
    },
    {
     "ts": "2026-11-07T22:35:39+00:00",
     "kind": "step",
     "step_id": "simular",
     "message": "Balance finished \"Balance simulations\" in 29.9s"
    },
    {
     "ts": "2026-11-07T22:35:39+00:00",
     "kind": "gate",
     "step_id": "ok_version",
     "message": "Awaiting approval: Approve the release"
    },
    {
     "ts": "2026-11-07T22:35:39+00:00",
     "kind": "approval",
     "step_id": "ok_version",
     "message": "Approved by owner"
    },
    {
     "ts": "2026-11-07T22:35:39+00:00",
     "kind": "step",
     "step_id": "publicar",
     "message": "Director started \"Ship the release\""
    },
    {
     "ts": "2026-11-07T22:35:39+00:00",
     "kind": "step",
     "step_id": "publicar",
     "message": "Director finished \"Ship the release\" in 217.6s"
    },
    {
     "ts": "2026-11-07T22:35:39+00:00",
     "kind": "session",
     "step_id": null,
     "message": "Session completed · 3 steps"
    }
   ]
  },
  "e8c0a1ae2d": {
   "id": "e8c0a1ae2d",
   "orchestration": "elitro-lab",
   "trigger": "bug",
   "engine": "mock",
   "status": "completed",
   "payload": {
    "demo": true
   },
   "created_at": "2026-11-07T22:35:39+00:00",
   "updated_at": "2026-11-07T22:35:39+00:00",
   "steps": [
    {
     "session_id": "e8c0a1ae2d",
     "step_id": "reporte_bug",
     "expert": "playtest",
     "status": "done",
     "output": "Playtester completed 'Reproduce bug report'.\nTask: Reproduce bug report\nContext received: 79 characters · simulated tokens: 5,544",
     "duration_s": 136.7,
     "cost_usd": 0.0499,
     "started_at": "2026-11-07T22:35:39+00:00",
     "finished_at": "2026-11-07T22:35:39+00:00"
    }
   ],
   "events": [
    {
     "ts": "2026-11-07T22:35:39+00:00",
     "kind": "session",
     "step_id": null,
     "message": "Session started by bug with the mock engine"
    },
    {
     "ts": "2026-11-07T22:35:39+00:00",
     "kind": "step",
     "step_id": "reporte_bug",
     "message": "Playtester started \"Reproduce bug report\""
    },
    {
     "ts": "2026-11-07T22:35:39+00:00",
     "kind": "step",
     "step_id": "reporte_bug",
     "message": "Playtester finished \"Reproduce bug report\" in 136.7s"
    },
    {
     "ts": "2026-11-07T22:35:39+00:00",
     "kind": "session",
     "step_id": null,
     "message": "Session completed · 1 steps"
    }
   ]
  },
  "7c52dbe9d6": {
   "id": "7c52dbe9d6",
   "orchestration": "elitro-lab",
   "trigger": "ciclo",
   "engine": "mock",
   "status": "awaiting_approval",
   "payload": {
    "demo": true
   },
   "created_at": "2026-11-07T22:35:38+00:00",
   "updated_at": "2026-11-07T22:35:39+00:00",
   "steps": [
    {
     "session_id": "7c52dbe9d6",
     "step_id": "problema",
     "expert": "director",
     "status": "done",
     "output": "Director completed 'Define the problem'.\nTask: Define the problem\nContext received: 77 characters · simulated tokens: 39,165",
     "duration_s": 54.7,
     "cost_usd": 0.3525,
     "started_at": "2026-11-07T22:35:38+00:00",
     "finished_at": "2026-11-07T22:35:38+00:00"
    },
    {
     "session_id": "7c52dbe9d6",
     "step_id": "biologia",
     "expert": "biologo",
     "status": "done",
     "output": "Biologist completed 'Biology research'.\nTask: Biology research\nContext received: 234 characters · simulated tokens: 16,912",
     "duration_s": 239.7,
     "cost_usd": 0.1522,
     "started_at": "2026-11-07T22:35:38+00:00",
     "finished_at": "2026-11-07T22:35:38+00:00"
    },
    {
     "session_id": "7c52dbe9d6",
     "step_id": "referencias",
     "expert": "investigador",
     "status": "done",
     "output": "Design Researcher completed 'Design references'.\nTask: Design references\nContext received: 235 characters · simulated tokens: 38,695",
     "duration_s": 37.4,
     "cost_usd": 0.3483,
     "started_at": "2026-11-07T22:35:38+00:00",
     "finished_at": "2026-11-07T22:35:38+00:00"
    },
    {
     "session_id": "7c52dbe9d6",
     "step_id": "economia",
     "expert": "recursos",
     "status": "done",
     "output": "Economy Analyst completed 'Economy analysis'.\nTask: Economy analysis\nContext received: 234 characters · simulated tokens: 20,021",
     "duration_s": 79.8,
     "cost_usd": 0.1802,
     "started_at": "2026-11-07T22:35:38+00:00",
     "finished_at": "2026-11-07T22:35:38+00:00"
    },
    {
     "session_id": "7c52dbe9d6",
     "step_id": "espacio",
     "expert": "tablero",
     "status": "done",
     "output": "Board Designer completed 'Board analysis'.\nTask: Board analysis\nContext received: 232 characters · simulated tokens: 30,486",
     "duration_s": 174.9,
     "cost_usd": 0.2744,
     "started_at": "2026-11-07T22:35:38+00:00",
     "finished_at": "2026-11-07T22:35:38+00:00"
    },
    {
     "session_id": "7c52dbe9d6",
     "step_id": "propuesta",
     "expert": "director",
     "status": "done",
     "output": "Director completed 'Change proposal'.\nTask: Change proposal\nContext received: 710 characters · simulated tokens: 16,052",
     "duration_s": 56.0,
     "cost_usd": 0.1445,
     "started_at": "2026-11-07T22:35:38+00:00",
     "finished_at": "2026-11-07T22:35:38+00:00"
    },
    {
     "session_id": "7c52dbe9d6",
     "step_id": "ok_propuesta",
     "expert": null,
     "status": "done",
     "output": "Approved by owner. Looks good",
     "duration_s": 0.0,
     "cost_usd": null,
     "started_at": "2026-11-07T22:35:38+00:00",
     "finished_at": "2026-11-07T22:35:38+00:00"
    },
    {
     "session_id": "7c52dbe9d6",
     "step_id": "disenar",
     "expert": "cartas",
     "status": "done",
     "output": "Card Designer completed 'Design cards'.\nTask: Design cards\nContext received: 137 characters · simulated tokens: 36,723",
     "duration_s": 199.8,
     "cost_usd": 0.3305,
     "started_at": "2026-11-07T22:35:38+00:00",
     "finished_at": "2026-11-07T22:35:38+00:00"
    },
    {
     "session_id": "7c52dbe9d6",
     "step_id": "implementar",
     "expert": "director",
     "status": "done",
     "output": "Director completed 'Implement'.\nTask: Implement\nContext received: 215 characters · simulated tokens: 39,018",
     "duration_s": 36.9,
     "cost_usd": 0.3512,
     "started_at": "2026-11-07T22:35:39+00:00",
     "finished_at": "2026-11-07T22:35:39+00:00"
    },
    {
     "session_id": "7c52dbe9d6",
     "step_id": "simular",
     "expert": "balance",
     "status": "done",
     "output": "Balance completed 'Balance simulations'.\nTask: Balance simulations\nContext received: 211 characters · simulated tokens: 28,697",
     "duration_s": 215.7,
     "cost_usd": 0.2583,
     "started_at": "2026-11-07T22:35:39+00:00",
     "finished_at": "2026-11-07T22:35:39+00:00"
    },
    {
     "session_id": "7c52dbe9d6",
     "step_id": "probar",
     "expert": "playtest",
     "status": "done",
     "output": "Playtester completed 'Playtest & soft-locks'.\nTask: Playtest & soft-locks\nContext received: 213 characters · simulated tokens: 8,455",
     "duration_s": 205.5,
     "cost_usd": 0.0761,
     "started_at": "2026-11-07T22:35:39+00:00",
     "finished_at": "2026-11-07T22:35:39+00:00"
    },
    {
     "session_id": "7c52dbe9d6",
     "step_id": "ok_version",
     "expert": null,
     "status": "awaiting_approval",
     "output": null,
     "duration_s": null,
     "cost_usd": null,
     "started_at": "2026-11-07T22:35:39+00:00",
     "finished_at": null
    },
    {
     "session_id": "7c52dbe9d6",
     "step_id": "publicar",
     "expert": "director",
     "status": "pending",
     "output": null,
     "duration_s": null,
     "cost_usd": null,
     "started_at": null,
     "finished_at": null
    }
   ],
   "events": [
    {
     "ts": "2026-11-07T22:35:38+00:00",
     "kind": "session",
     "step_id": null,
     "message": "Session started by ciclo with the mock engine"
    },
    {
     "ts": "2026-11-07T22:35:38+00:00",
     "kind": "step",
     "step_id": "problema",
     "message": "Director started \"Define the problem\""
    },
    {
     "ts": "2026-11-07T22:35:38+00:00",
     "kind": "step",
     "step_id": "problema",
     "message": "Director finished \"Define the problem\" in 54.7s"
    },
    {
     "ts": "2026-11-07T22:35:38+00:00",
     "kind": "step",
     "step_id": "biologia",
     "message": "Biologist started \"Biology research\""
    },
    {
     "ts": "2026-11-07T22:35:38+00:00",
     "kind": "step",
     "step_id": "referencias",
     "message": "Design Researcher started \"Design references\""
    },
    {
     "ts": "2026-11-07T22:35:38+00:00",
     "kind": "step",
     "step_id": "economia",
     "message": "Economy Analyst started \"Economy analysis\""
    },
    {
     "ts": "2026-11-07T22:35:38+00:00",
     "kind": "step",
     "step_id": "espacio",
     "message": "Board Designer started \"Board analysis\""
    },
    {
     "ts": "2026-11-07T22:35:38+00:00",
     "kind": "step",
     "step_id": "espacio",
     "message": "Board Designer finished \"Board analysis\" in 174.9s"
    },
    {
     "ts": "2026-11-07T22:35:38+00:00",
     "kind": "step",
     "step_id": "referencias",
     "message": "Design Researcher finished \"Design references\" in 37.4s"
    },
    {
     "ts": "2026-11-07T22:35:38+00:00",
     "kind": "step",
     "step_id": "biologia",
     "message": "Biologist finished \"Biology research\" in 239.7s"
    },
    {
     "ts": "2026-11-07T22:35:38+00:00",
     "kind": "step",
     "step_id": "economia",
     "message": "Economy Analyst finished \"Economy analysis\" in 79.8s"
    },
    {
     "ts": "2026-11-07T22:35:38+00:00",
     "kind": "step",
     "step_id": "propuesta",
     "message": "Director started \"Change proposal\""
    },
    {
     "ts": "2026-11-07T22:35:38+00:00",
     "kind": "step",
     "step_id": "propuesta",
     "message": "Director finished \"Change proposal\" in 56.0s"
    },
    {
     "ts": "2026-11-07T22:35:38+00:00",
     "kind": "gate",
     "step_id": "ok_propuesta",
     "message": "Awaiting approval: Approve the proposal"
    },
    {
     "ts": "2026-11-07T22:35:38+00:00",
     "kind": "approval",
     "step_id": "ok_propuesta",
     "message": "Approved by owner"
    },
    {
     "ts": "2026-11-07T22:35:38+00:00",
     "kind": "step",
     "step_id": "disenar",
     "message": "Card Designer started \"Design cards\""
    },
    {
     "ts": "2026-11-07T22:35:38+00:00",
     "kind": "step",
     "step_id": "disenar",
     "message": "Card Designer finished \"Design cards\" in 199.8s"
    },
    {
     "ts": "2026-11-07T22:35:39+00:00",
     "kind": "step",
     "step_id": "implementar",
     "message": "Director started \"Implement\""
    },
    {
     "ts": "2026-11-07T22:35:39+00:00",
     "kind": "step",
     "step_id": "implementar",
     "message": "Director finished \"Implement\" in 36.9s"
    },
    {
     "ts": "2026-11-07T22:35:39+00:00",
     "kind": "step",
     "step_id": "simular",
     "message": "Balance started \"Balance simulations\""
    },
    {
     "ts": "2026-11-07T22:35:39+00:00",
     "kind": "step",
     "step_id": "probar",
     "message": "Playtester started \"Playtest & soft-locks\""
    },
    {
     "ts": "2026-11-07T22:35:39+00:00",
     "kind": "step",
     "step_id": "probar",
     "message": "Playtester finished \"Playtest & soft-locks\" in 205.5s"
    },
    {
     "ts": "2026-11-07T22:35:39+00:00",
     "kind": "step",
     "step_id": "simular",
     "message": "Balance finished \"Balance simulations\" in 215.7s"
    },
    {
     "ts": "2026-11-07T22:35:39+00:00",
     "kind": "gate",
     "step_id": "ok_version",
     "message": "Awaiting approval: Approve the release"
    }
   ]
  },
  "24bd10d487": {
   "id": "24bd10d487",
   "orchestration": "ciencia-lab",
   "trigger": "semanal",
   "engine": "mock",
   "status": "completed",
   "payload": {
    "demo": true
   },
   "created_at": "2026-11-07T22:35:38+00:00",
   "updated_at": "2026-11-07T22:35:38+00:00",
   "steps": [
    {
     "session_id": "24bd10d487",
     "step_id": "reporte",
     "expert": "analista",
     "status": "done",
     "output": "Analyst completed 'Weekly report'.\nTask: Weekly report\nContext received: 272 characters · simulated tokens: 21,129",
     "duration_s": 26.4,
     "cost_usd": 0.1902,
     "started_at": "2026-11-07T22:35:38+00:00",
     "finished_at": "2026-11-07T22:35:38+00:00"
    }
   ],
   "events": [
    {
     "ts": "2026-11-07T22:35:38+00:00",
     "kind": "session",
     "step_id": null,
     "message": "Session started by semanal with the mock engine"
    },
    {
     "ts": "2026-11-07T22:35:38+00:00",
     "kind": "step",
     "step_id": "reporte",
     "message": "Analyst started \"Weekly report\""
    },
    {
     "ts": "2026-11-07T22:35:38+00:00",
     "kind": "step",
     "step_id": "reporte",
     "message": "Analyst finished \"Weekly report\" in 26.4s"
    },
    {
     "ts": "2026-11-07T22:35:38+00:00",
     "kind": "session",
     "step_id": null,
     "message": "Session completed · 1 steps"
    }
   ]
  },
  "ff9c748216": {
   "id": "ff9c748216",
   "orchestration": "ciencia-lab",
   "trigger": "episodio",
   "engine": "mock",
   "status": "awaiting_approval",
   "payload": {
    "demo": true
   },
   "created_at": "2026-11-07T22:35:38+00:00",
   "updated_at": "2026-11-07T22:35:38+00:00",
   "steps": [
    {
     "session_id": "ff9c748216",
     "step_id": "plan",
     "expert": "ceo",
     "status": "done",
     "output": "CEO completed 'Plan the episode'.\nTask: Plan the episode\nContext received: 75 characters · simulated tokens: 6,541",
     "duration_s": 29.7,
     "cost_usd": 0.0589,
     "started_at": "2026-11-07T22:35:38+00:00",
     "finished_at": "2026-11-07T22:35:38+00:00"
    },
    {
     "session_id": "ff9c748216",
     "step_id": "brief",
     "expert": "investigador",
     "status": "done",
     "output": "Researcher completed 'Sourced brief'.\nTask: Sourced brief\nContext received: 219 characters · simulated tokens: 4,458",
     "duration_s": 95.5,
     "cost_usd": 0.0401,
     "started_at": "2026-11-07T22:35:38+00:00",
     "finished_at": "2026-11-07T22:35:38+00:00"
    },
    {
     "session_id": "ff9c748216",
     "step_id": "guion",
     "expert": "guionista",
     "status": "done",
     "output": "Scriptwriter completed 'Beat-by-beat script'.\nTask: Beat-by-beat script\nContext received: 336 characters · simulated tokens: 37,241",
     "duration_s": 175.9,
     "cost_usd": 0.3352,
     "started_at": "2026-11-07T22:35:38+00:00",
     "finished_at": "2026-11-07T22:35:38+00:00"
    },
    {
     "session_id": "ff9c748216",
     "step_id": "verificar",
     "expert": "factcheck",
     "status": "done",
     "output": "Fact-checker completed 'Fact-check'.\nTask: Fact-check\nContext received: 348 characters · simulated tokens: 17,237",
     "duration_s": 119.6,
     "cost_usd": 0.1551,
     "started_at": "2026-11-07T22:35:38+00:00",
     "finished_at": "2026-11-07T22:35:38+00:00"
    },
    {
     "session_id": "ff9c748216",
     "step_id": "ok_guion",
     "expert": null,
     "status": "done",
     "output": "Approved by owner. Looks good",
     "duration_s": 0.0,
     "cost_usd": null,
     "started_at": "2026-11-07T22:35:38+00:00",
     "finished_at": "2026-11-07T22:35:38+00:00"
    },
    {
     "session_id": "ff9c748216",
     "step_id": "narrar",
     "expert": "voz",
     "status": "done",
     "output": "Voice Director completed 'Narration & timeline'.\nTask: Narration & timeline\nContext received: 343 characters · simulated tokens: 31,570",
     "duration_s": 79.5,
     "cost_usd": 0.2841,
     "started_at": "2026-11-07T22:35:38+00:00",
     "finished_at": "2026-11-07T22:35:38+00:00"
    },
    {
     "session_id": "ff9c748216",
     "step_id": "animar",
     "expert": "animador",
     "status": "done",
     "output": "Animator completed 'Manim animation'.\nTask: Manim animation\nContext received: 446 characters · simulated tokens: 36,138",
     "duration_s": 42.9,
     "cost_usd": 0.3252,
     "started_at": "2026-11-07T22:35:38+00:00",
     "finished_at": "2026-11-07T22:35:38+00:00"
    },
    {
     "session_id": "ff9c748216",
     "step_id": "musica",
     "expert": "musico",
     "status": "done",
     "output": "Composer completed 'Original score'.\nTask: Original score\nContext received: 445 characters · simulated tokens: 25,626",
     "duration_s": 43.3,
     "cost_usd": 0.2306,
     "started_at": "2026-11-07T22:35:38+00:00",
     "finished_at": "2026-11-07T22:35:38+00:00"
    },
    {
     "session_id": "ff9c748216",
     "step_id": "mezclar",
     "expert": "sonido",
     "status": "done",
     "output": "Sound Designer completed 'Sound effects & mix'.\nTask: Sound effects & mix\nContext received: 577 characters · simulated tokens: 31,308",
     "duration_s": 214.4,
     "cost_usd": 0.2818,
     "started_at": "2026-11-07T22:35:38+00:00",
     "finished_at": "2026-11-07T22:35:38+00:00"
    },
    {
     "session_id": "ff9c748216",
     "step_id": "qa",
     "expert": "qa",
     "status": "done",
     "output": "QA completed 'Technical & content QA'.\nTask: Technical & content QA\nContext received: 450 characters · simulated tokens: 8,820",
     "duration_s": 32.8,
     "cost_usd": 0.0794,
     "started_at": "2026-11-07T22:35:38+00:00",
     "finished_at": "2026-11-07T22:35:38+00:00"
    },
    {
     "session_id": "ff9c748216",
     "step_id": "ok_video",
     "expert": null,
     "status": "awaiting_approval",
     "output": null,
     "duration_s": null,
     "cost_usd": null,
     "started_at": "2026-11-07T22:35:38+00:00",
     "finished_at": null
    },
    {
     "session_id": "ff9c748216",
     "step_id": "publicar",
     "expert": "publicador",
     "status": "pending",
     "output": null,
     "duration_s": null,
     "cost_usd": null,
     "started_at": null,
     "finished_at": null
    }
   ],
   "events": [
    {
     "ts": "2026-11-07T22:35:38+00:00",
     "kind": "session",
     "step_id": null,
     "message": "Session started by episodio with the mock engine"
    },
    {
     "ts": "2026-11-07T22:35:38+00:00",
     "kind": "step",
     "step_id": "plan",
     "message": "CEO started \"Plan the episode\""
    },
    {
     "ts": "2026-11-07T22:35:38+00:00",
     "kind": "step",
     "step_id": "plan",
     "message": "CEO finished \"Plan the episode\" in 29.7s"
    },
    {
     "ts": "2026-11-07T22:35:38+00:00",
     "kind": "step",
     "step_id": "brief",
     "message": "Researcher started \"Sourced brief\""
    },
    {
     "ts": "2026-11-07T22:35:38+00:00",
     "kind": "step",
     "step_id": "brief",
     "message": "Researcher finished \"Sourced brief\" in 95.5s"
    },
    {
     "ts": "2026-11-07T22:35:38+00:00",
     "kind": "memory",
     "step_id": "brief",
     "message": "Researcher: in \"Sourced brief\", validate the input before starting."
    },
    {
     "ts": "2026-11-07T22:35:38+00:00",
     "kind": "step",
     "step_id": "guion",
     "message": "Scriptwriter started \"Beat-by-beat script\""
    },
    {
     "ts": "2026-11-07T22:35:38+00:00",
     "kind": "step",
     "step_id": "guion",
     "message": "Scriptwriter finished \"Beat-by-beat script\" in 175.9s"
    },
    {
     "ts": "2026-11-07T22:35:38+00:00",
     "kind": "step",
     "step_id": "verificar",
     "message": "Fact-checker started \"Fact-check\""
    },
    {
     "ts": "2026-11-07T22:35:38+00:00",
     "kind": "step",
     "step_id": "verificar",
     "message": "Fact-checker finished \"Fact-check\" in 119.6s"
    },
    {
     "ts": "2026-11-07T22:35:38+00:00",
     "kind": "memory",
     "step_id": "verificar",
     "message": "Fact-checker: in \"Fact-check\", validate the input before starting."
    },
    {
     "ts": "2026-11-07T22:35:38+00:00",
     "kind": "gate",
     "step_id": "ok_guion",
     "message": "Awaiting approval: Approve the script"
    },
    {
     "ts": "2026-11-07T22:35:38+00:00",
     "kind": "approval",
     "step_id": "ok_guion",
     "message": "Approved by owner"
    },
    {
     "ts": "2026-11-07T22:35:38+00:00",
     "kind": "step",
     "step_id": "narrar",
     "message": "Voice Director started \"Narration & timeline\""
    },
    {
     "ts": "2026-11-07T22:35:38+00:00",
     "kind": "step",
     "step_id": "narrar",
     "message": "Voice Director finished \"Narration & timeline\" in 79.5s"
    },
    {
     "ts": "2026-11-07T22:35:38+00:00",
     "kind": "step",
     "step_id": "animar",
     "message": "Animator started \"Manim animation\""
    },
    {
     "ts": "2026-11-07T22:35:38+00:00",
     "kind": "step",
     "step_id": "musica",
     "message": "Composer started \"Original score\""
    },
    {
     "ts": "2026-11-07T22:35:38+00:00",
     "kind": "step",
     "step_id": "musica",
     "message": "Composer finished \"Original score\" in 43.3s"
    },
    {
     "ts": "2026-11-07T22:35:38+00:00",
     "kind": "step",
     "step_id": "animar",
     "message": "Animator finished \"Manim animation\" in 42.9s"
    },
    {
     "ts": "2026-11-07T22:35:38+00:00",
     "kind": "step",
     "step_id": "mezclar",
     "message": "Sound Designer started \"Sound effects & mix\""
    },
    {
     "ts": "2026-11-07T22:35:38+00:00",
     "kind": "step",
     "step_id": "mezclar",
     "message": "Sound Designer finished \"Sound effects & mix\" in 214.4s"
    },
    {
     "ts": "2026-11-07T22:35:38+00:00",
     "kind": "step",
     "step_id": "qa",
     "message": "QA started \"Technical & content QA\""
    },
    {
     "ts": "2026-11-07T22:35:38+00:00",
     "kind": "step",
     "step_id": "qa",
     "message": "QA finished \"Technical & content QA\" in 32.8s"
    },
    {
     "ts": "2026-11-07T22:35:38+00:00",
     "kind": "gate",
     "step_id": "ok_video",
     "message": "Awaiting approval: Approve the final video"
    }
   ]
  }
 },
 "stats": {
  "sessions": 11,
  "by_status": {
   "awaiting_approval": 4,
   "completed": 7
  },
  "steps_done": 60,
  "agent_seconds": 5487.1,
  "cost_usd": 8.5681,
  "per_orchestration": {
   "ciencia-lab": 2,
   "dev-loop": 2,
   "elitro-lab": 3,
   "ofertasradar": 4
  }
 },
 "tickets": [
  {
   "name": "Capitalize",
   "title": "Add a capitalize helper",
   "status": "done",
   "repo": "a private repo",
   "labels": [
    "enhancement"
   ],
   "issue": null,
   "pr": null,
   "session": "e53ac28c8f",
   "session_status": "completed",
   "verdict": "approve"
  },
  {
   "name": "Tooltip",
   "title": "Add a Tooltip component to Blueprint",
   "status": "idea",
   "repo": "fabiannabi/fabiannabi.github.io",
   "labels": [
    "component"
   ],
   "issue": null,
   "pr": null,
   "session": null,
   "session_status": null,
   "verdict": null
  }
 ]
};
