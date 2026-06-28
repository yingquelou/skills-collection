---
name: pulling-updates-from-skills-repository
description: 当用户需要更新技能、同步技能仓库、拉取 skill 仓库最新版或检查技能是否最新时触发，指导 AI 以 Git 与 PowerShell 盘点并应用远端技能变更。
---

# 拉取技能仓库最新版

## 场景识别

当用户表达以下任一意图时触发本技能：
- 更新技能、升级技能
- 同步技能仓库、同步远端
- 拉取 skill 仓库最新版、获取上游改动
- 检查技能是否最新、盘点本地与远端差异

典型响应：使用 Git 与 PowerShell 在 Windows 上完成盘点、评估、应用、验证与回滚。

## 盘点方法

在 `c:\Users\yingquelou\.trae-cn\skills` 执行：

```powershell
Set-Location c:\Users\yingquelou\.trae-cn\skills
git fetch --all --prune
git status --porcelain
git log --oneline HEAD..origin/main
git diff --name-status HEAD origin/main
```

统计当前本地审计快照：

```powershell
$tracked  = git status --porcelain | Where-Object { $_ -match '^[ MAR][MDRC]' }
$untracked = git status --porcelain | Where-Object { $_ -match '^\?\?' }
"tracked_modified=$($tracked.Count) untracked_dirs=$($untracked.Count)"
```

当前审计：**17 个已跟踪的修改项**，**37 个未跟踪的技能目录**。

已跟踪修改（17）：
- skills/brainstorming
- skills/dispatching-parallel-agents
- skills/executing-plans
- skills/finishing-a-development-branch
- skills/receiving-code-review
- skills/requesting-code-review
- skills/subagent-driven-development
- skills/systematic-debugging
- skills/test-driven-development
- skills/using-superpowers
- skills/writing-plans
- skills/writing-skills

未跟踪技能目录（37）：
- Flex-Bison-Expertise, algorithmic-art, api-design, brand-guidelines, canvas-design
- cicd-pipeline, code-quality, collision-zone-thinking, condition-based-waiting
- database-design, defense-in-depth, dependency-management, doc-coauthoring
- frontend-design, gardening-skills-wiki, ghostscript-runtime-integration
- internal-comms, inversion-exercise, mcp-builder, meta-pattern-recognition
- performance-optimization, preserving-productive-tensions, refactoring
- remembering-conversations, root-cause-tracing, scale-game, sharing-skills
- simplification-cascades, skill-creator, slack-gif-creator, testing-anti-patterns
- testing-skills-with-subagents, theme-factory, tracing-knowledge-lineages
- web-artifacts-builder, webapp-testing, when-stuck

## 远程可达流程

适用于可访问 `origin` 的场景：

```powershell
Set-Location c:\Users\yingquelou\.trae-cn\skills
git status
git stash push -u -m "pre-pull-$(Get-Date -Format yyyyMMdd-HHmmss)"
git pull --rebase origin main
git stash pop
git log --oneline -n 10
```

若 `stash pop` 冲突：先执行 `git stash show -p` 审阅差异，手动解决后 `git stash drop`。

## 离线降级流程

无网络或远端不可达时：

```powershell
Set-Location c:\Users\yingquelou\.trae-cn\skills
git log --oneline -n 20
git branch -a
git diff HEAD~10..HEAD --stat
Get-ChildItem -Directory | ForEach-Object {
  $m = Join-Path $_.FullName 'SKILL.md'
  if (Test-Path $m) {
    [PSCustomObject]@{ Dir = $_.Name; LastWrite = (Get-Item $m).LastWriteTime }
  }
} | Sort-Object LastWrite -Descending | Select-Object -First 10
```

以本地提交日志和文件修改时间作为“最新”的近似判据，向用户说明无法拉取远端的原因，并建议在网络恢复后重跑远程可达流程。

## 评估标准

在应用更新前按以下维度评估：

- 差异规模：`git diff --stat HEAD origin/main` 行数与文件数
- 影响范围：是否涉及 `SKILL.md`、脚本、提示模板等核心资产
- 冲突风险：本地未提交改动（17 项）与远端是否重叠
- 兼容性：新技能是否引入新的触发词或依赖
- 优先级：安全修复 > 缺陷修复 > 功能增强 > 文档润色

评分建议（每项 0-2）：差异规模、影响范围、冲突风险、兼容性、优先级，总分 ≥ 6 方可自动应用，否则需用户确认。

## 应用策略

- 增量应用：优先 `git pull --rebase`，保留本地提交历史
- 选择性应用：对冲突较大的技能目录，使用 `git checkout origin/main -- <dir>` 单目录同步
- 保护本地：对 17 项本地修改目录，`git stash` 或建立临时分支 `git checkout -b backup/pre-update-<ts>`
- 保留新增：37 个未跟踪目录默认保留，仅在远端存在同名目录时提示合并
- 锁定版本：必要时 `git tag freeze-<ts>` 标记当前稳定点

```powershell
Set-Location c:\Users\yingquelou\.trae-cn\skills
git checkout -b backup/pre-update-$(Get-Date -Format yyyyMMdd-HHmmss)
git pull --rebase origin main
git tag freeze-$(Get-Date -Format yyyyMMdd-HHmmss)
```

## 验证步骤

应用后必须完成：

```powershell
Set-Location c:\Users\yingquelou\.trae-cn\skills
git status
git log --oneline -n 5
Get-ChildItem -Directory | Where-Object { $_.Name -ne 'skills' } | ForEach-Object {
  $m = Join-Path $_.FullName 'SKILL.md'
  [PSCustomObject]@{ Dir = $_.Name; HasSkillMd = (Test-Path $m) }
} | Where-Object { -not $_.HasSkillMd }
```

核对项：
- 远端 HEAD 与本地 HEAD 一致
- 37 个未跟踪目录中仍保留用户自定义项
- 17 个本地修改目录未被静默覆盖
- 所有技能目录仍包含 `SKILL.md`
- 触发词能正确命中本技能场景

## 回滚建议

若更新后异常，按以下顺序回滚：

```powershell
Set-Location c:\Users\yingquelou\.trae-cn\skills
git log --oneline -n 5
git reset --hard HEAD@{1}
if (git stash list) { git stash pop }
git status
```

若已打标签：

```powershell
git tag
git reset --hard freeze-<ts>
```

回滚后重新执行验证步骤并记录失败原因，在 `_audit.md` 中登记本次回滚时间与触发技能名，供后续迭代参考。
