---
name: n8n-xhs-workflow
description: 小红书内容创作 n8n 工作流专家。用于：(1) 创建小红书文案生成工作流，(2) 配置 AI Agent 节点生成小红书风格文案，(3) 配图生成（记事本风格/Pexels素材/AI生成），(4) 视频生成工作流，(5) 批量发布到小红书。当用户提到 n8n、小红书、工作流、自动化发布、文案生成时使用此技能。配合 n8n-mcp 工具查询节点文档。
---

# n8n 小红书内容创作工作流

创建和管理小红书内容自动化工作流的专家指南。

## 工作流类型

| 类型 | 用途 | 触发方式 |
|------|------|----------|
| **内容创作** | URL/文案 → AI文案 → 配图 → 视频 | 表单触发 |
| **批量发布** | Notion数据库 → 生成内容 → 自动发布 | 定时/手动 |

## 核心节点配置

### 1. AI Agent 文案生成

```json
{
  "type": "@n8n/n8n-nodes-langchain.agent",
  "parameters": {
    "promptType": "define",
    "text": "=文案内容：{{ $json.cleanText }}",
    "hasOutputParser": true,
    "options": {
      "systemMessage": "你是小红书内容创作专家..."
    }
  }
}
```

**输出结构**（Structured Output Parser）：
```json
{
  "Xhs_Copywriter": "小红书文案内容",
  "Pic_Description": "配图描述（用于AI生图）",
  "Pic_Keywords": "图片关键词（英文，逗号分隔）",
  "Pic_Sentences": "图片文案（换行分隔）"
}
```

### 2. 配图生成（三选一）

| 风格 | 实现方式 | 节点 |
|------|----------|------|
| 记事本风格 | 本地背景图 + 文字叠加 | Read File → Edit Image |
| 普通风格 | Pexels API 搜索 + 模糊 + 文字 | HTTP Request → Edit Image |
| AI生成 | Replicate Imagen-4 API | HTTP Request（POST） |

### 3. 视频生成

调用外部视频 API（如 MoneyPrinterTurbo）：
```
POST http://host.docker.internal:8080/api/v1/videos
```

## 文案风格模板

10种预设风格，详见 [references/copywriting_styles.md](references/copywriting_styles.md)：
- 通用风格、女性成长、美食探店、母婴、好物推荐
- 家居、户外出行、美妆穿搭、创业副业、知识技能

## 快速创建工作流

1. **表单触发器** - 收集：内容来源、文案风格、配图风格、是否生成视频
2. **URL判断** - If 节点正则匹配判断输入是URL还是文案
3. **内容提取** - HTTP Request + Code 节点清洗 HTML
4. **AI生成** - DeepSeek/OpenAI + Structured Output Parser
5. **配图处理** - Switch 节点分发到不同配图逻辑
6. **保存/发布** - Read/Write File 或 MCP 发布

## 与 n8n-mcp 配合

已配置 n8n-mcp 服务器，可直接查询：
- 节点文档和参数
- 工作流模板
- 社区节点信息

## 工作流模板

参考 [assets/](assets/) 目录下的 JSON 模板文件。
