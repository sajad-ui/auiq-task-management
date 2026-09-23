import React, { useState } from 'react';
import JSZip from 'jszip';
import { 
  FolderDown, 
  Copy, 
  Check, 
  Terminal, 
  Code2, 
  Download, 
  FileCode, 
  FolderCheck, 
  Play, 
  Laptop,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { ORG_HIERARCHY } from '../data/orgHierarchy';
import { INITIAL_TASKS } from '../data/initialTasks';

export const PythonProjectExport: React.FC = () => {
  const [copiedFile, setCopiedFile] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'script' | 'app' | 'html' | 'requirements' | 'instructions'>('instructions');
  const [isZipping, setIsZipping] = useState(false);

  const targetPath = 'C:\\Users\\sajja\\OneDrive\\Desktop\\des\\موقع ادارة المهام';

  // Python Flask/SQLite complete server
  const pythonAppCode = `# ==============================================================================
# منظومة إدارة المهام - مكتب رئيس جامعة العين العراقية (AUIQ)
# تم التطوير بلغة بايثون (Flask + SQLite) للعمل على كافة الأجهزة
# المسار المستهدف: C:\\Users\\sajja\\OneDrive\\Desktop\\des\\موقع ادارة المهام
# ==============================================================================

from flask import Flask, render_template, request, jsonify, send_from_directory
import sqlite3
import json
import os
from datetime import datetime

app = Flask(__name__, template_folder='templates', static_folder='static')
DB_PATH = 'auiq_task_management.db'

def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db()
    cursor = conn.cursor()
    
    # جدول تشكيلات الهيكل التنظيمي
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS org_hierarchy (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        level TEXT NOT NULL,
        category TEXT NOT NULL,
        code TEXT NOT NULL,
        head_title TEXT,
        head_name TEXT,
        parent_id TEXT
    )
    ''')
    
    # جدول المهام والتكليفات الرئاسية
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS tasks (
        id TEXT PRIMARY KEY,
        code TEXT NOT NULL,
        title TEXT NOT NULL,
        description TEXT,
        directive_type TEXT NOT NULL,
        official_ref_number TEXT,
        target_node_id TEXT NOT NULL,
        target_node_name TEXT NOT NULL,
        target_node_level TEXT NOT NULL,
        priority TEXT NOT NULL,
        status TEXT NOT NULL,
        progress INTEGER DEFAULT 0,
        due_date TEXT NOT NULL,
        created_at TEXT NOT NULL,
        created_by TEXT DEFAULT 'مكتب رئيس الجامعة',
        assigned_officer TEXT,
        instructions TEXT,
        confidential INTEGER DEFAULT 0,
        FOREIGN KEY (target_node_id) REFERENCES org_hierarchy(id)
    )
    ''')
    
    # تفريغ أولي إذا كانت الجداول فارغة
    cursor.execute('SELECT COUNT(*) FROM org_hierarchy')
    if cursor.fetchone()[0] == 0:
        # إدراج تشكيلات جامعة العين العراقية
        departments = ${JSON.stringify(ORG_HIERARCHY.slice(0, 30).map(n => ({
          id: n.id,
          name: n.name,
          level: n.level,
          category: n.category,
          code: n.code,
          head_title: n.headTitle || '',
          head_name: n.headName || '',
          parent_id: n.parentId || ''
        })), null, 2)}
        
        for d in departments:
            cursor.execute('''
            INSERT INTO org_hierarchy (id, name, level, category, code, head_title, head_name, parent_id)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            ''', (d['id'], d['name'], d['level'], d['category'], d['code'], d['head_title'], d['head_name'], d['parent_id']))

    cursor.execute('SELECT COUNT(*) FROM tasks')
    if cursor.fetchone()[0] == 0:
        # إدراج المهام الأولية
        initial_tasks = ${JSON.stringify(INITIAL_TASKS.map(t => ({
          id: t.id,
          code: t.code,
          title: t.title,
          description: t.description,
          directive_type: t.directiveType,
          official_ref_number: t.officialRefNumber,
          target_node_id: t.targetNodeId,
          target_node_name: t.targetNodeName,
          target_node_level: t.targetNodeLevel,
          priority: t.priority,
          status: t.status,
          progress: t.progress,
          due_date: t.dueDate,
          created_at: t.createdAt,
          assigned_officer: t.assignedOfficer,
          instructions: t.instructions,
        })), null, 2)}
        
        for t in initial_tasks:
            cursor.execute('''
            INSERT INTO tasks (id, code, title, description, directive_type, official_ref_number, 
                               target_node_id, target_node_name, target_node_level, priority, 
                               status, progress, due_date, created_at, assigned_officer, instructions)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ''', (t['id'], t['code'], t['title'], t['description'], t['directive_type'], t['official_ref_number'],
                  t['target_node_id'], t['target_node_name'], t['target_node_level'], t['priority'],
                  t['status'], t['progress'], t['due_date'], t['created_at'], t['assigned_officer'], t['instructions']))

    conn.commit()
    conn.close()

# Routes
@app.route('/')
def home():
    return render_template('index.html')

@app.route('/api/stats')
def api_stats():
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute('SELECT COUNT(*) as total FROM tasks')
    total = cursor.fetchone()['total']
    cursor.execute('SELECT COUNT(*) as completed FROM tasks WHERE status = "completed"')
    completed = cursor.fetchone()['completed']
    cursor.execute('SELECT COUNT(*) as urgent FROM tasks WHERE priority = "high_urgent" AND status != "completed"')
    urgent = cursor.fetchone()['urgent']
    cursor.execute('SELECT COUNT(*) as in_progress FROM tasks WHERE status = "in_progress"')
    in_progress = cursor.fetchone()['in_progress']
    conn.close()
    
    rate = round((completed / total * 100) if total > 0 else 0)
    return jsonify({
        'total': total,
        'completed': completed,
        'urgent': urgent,
        'in_progress': in_progress,
        'completion_rate': rate
    })

@app.route('/api/tasks', methods=['GET', 'POST'])
def api_tasks():
    conn = get_db()
    cursor = conn.cursor()
    
    if request.method == 'POST':
        data = request.json
        task_id = f"task_{int(datetime.now().timestamp())}"
        code = f"AUIQ-2026-{int(datetime.now().timestamp()) % 1000:03d}"
        created_at = datetime.now().strftime('%Y-%m-%d')
        
        cursor.execute('''
        INSERT INTO tasks (id, code, title, description, directive_type, official_ref_number,
                           target_node_id, target_node_name, target_node_level, priority,
                           status, progress, due_date, created_at, assigned_officer, instructions)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            task_id, code, data.get('title'), data.get('description', ''),
            data.get('directive_type', 'رئاسي'), data.get('official_ref_number', 'ر/2026'),
            data.get('target_node_id'), data.get('target_node_name'),
            data.get('target_node_level', 'department'), data.get('priority', 'urgent'),
            data.get('status', 'new'), int(data.get('progress', 0)),
            data.get('due_date'), created_at, data.get('assigned_officer', ''),
            data.get('instructions', '')
        ))
        conn.commit()
        conn.close()
        return jsonify({'status': 'success', 'task_id': task_id, 'code': code}), 201

    # GET
    cursor.execute('SELECT * FROM tasks ORDER BY created_at DESC')
    rows = cursor.fetchall()
    tasks_list = [dict(ix) for ix in rows]
    conn.close()
    return jsonify(tasks_list)

@app.route('/api/tasks/<task_id>', methods=['PUT', 'DELETE'])
def api_task_detail(task_id):
    conn = get_db()
    cursor = conn.cursor()
    if request.method == 'PUT':
        data = request.json
        cursor.execute('''
        UPDATE tasks SET status = ?, progress = ? WHERE id = ?
        ''', (data.get('status'), int(data.get('progress', 0)), task_id))
        conn.commit()
        conn.close()
        return jsonify({'status': 'updated'})
    elif request.method == 'DELETE':
        cursor.execute('DELETE FROM tasks WHERE id = ?', (task_id,))
        conn.commit()
        conn.close()
        return jsonify({'status': 'deleted'})

@app.route('/api/org-hierarchy')
def api_org():
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM org_hierarchy')
    rows = cursor.fetchall()
    org_list = [dict(ix) for ix in rows]
    conn.close()
    return jsonify(org_list)

if __name__ == '__main__':
    init_db()
    print("==================================================================")
    print(" منظومة إدارة المهام - مكتب رئيس جامعة العين العراقية (AUIQ)")
    print(" تم تشغيل السيرفر بنجاح على العنوان: http://localhost:5000")
    print(" يعمل على كافة الأجهزة (الحاسوب، الآيباد، والهاتف المحمول)")
    print("==================================================================")
    app.run(host='0.0.0.0', port=5000, debug=True)
`;

  // Windows BAT auto-launcher
  const setupBatScript = `@echo off
chcp 65001 >nul
title منظومة إدارة المهام - مكتب رئيس جامعة العين العراقية
echo ==============================================================================
echo   منظومة إدارة المهام والتكليفات - مكتب رئيس جامعة العين العراقية (AUIQ)
echo   المسار المستهدف: ${targetPath}
echo ==============================================================================
echo.

set TARGET_DIR=${targetPath}
if not exist "%TARGET_DIR%" (
    echo [*] جاري إنشاء المجلد المستهدف...
    mkdir "%TARGET_DIR%"
)

cd /d "%TARGET_DIR%"

echo [*] جاري فحص بيئة بايثون Python...
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [!] خطأ: بايثون غير مثبت على هذا الجهاز! يرجى تثبيت Python 3.9+ من python.org
    pause
    exit /b
)

echo [*] جاري إعداد البيئة الافتراضية Virtualenv...
if not exist "venv" (
    python -m venv venv
)

call venv\\Scripts\\activate.bat

echo [*] جاري تثبيت متطلبات المشروع (Flask, SQLite)...
pip install -r requirements.txt

echo.
echo [*] تشغيل السيرفر وفتح الموقع في المتصفح...
start http://localhost:5000
python app.py
pause
`;

  // requirements.txt
  const requirementsTxt = `Flask==3.0.2
Werkzeug==3.0.1
Jinja2==3.1.3
`;

  // templates/index.html with water ripple canvas
  const templateHtml = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>منظومة إدارة المهام - مكتب رئيس جامعة العين العراقية</title>
    <!-- خطوط عربية جميلة: القاهرة، تجوال، والأميري -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Amiri:ital,wght@0,400;0,700;1,400&family=Cairo:wght@300;400;500;600;700;800;900&family=Tajawal:wght@300;400;500;700;800&display=swap" rel="stylesheet">
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        body {
            font-family: 'Cairo', 'Tajawal', sans-serif;
            background-color: #030712;
            color: #f3f4f6;
            margin: 0;
            overflow-x: hidden;
        }
        #waterRippleCanvas {
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            pointer-events: none;
            z-index: 50;
            mix-blend-mode: screen;
        }
    </style>
</head>
<body class="min-h-screen bg-slate-950 text-slate-100 selection:bg-amber-500 selection:text-slate-950">
    <!-- كانفاس تموج الماء التفاعلي عند تحريك المؤشر -->
    <canvas id="waterRippleCanvas"></canvas>

    <!-- رأس الصفحة الرسمي -->
    <header class="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950/90 backdrop-blur-md">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
            <div class="flex items-center gap-3">
                <div class="bg-white rounded-xl p-1.5 shadow-sm border border-slate-200/20 flex items-center justify-center">
                    <img src="/static/assets/ministry_logo.svg" alt="شعار وزارة التعليم العالي والبحث العلمي" class="w-10 h-10 object-contain" />
                </div>
                <div class="h-8 w-px bg-slate-700/80"></div>
                <div class="bg-white rounded-xl p-1.5 shadow-sm border border-slate-200/20 flex items-center justify-center">
                    <img src="/static/assets/alayen_logo.png" alt="شعار جامعة العين العراقية" class="h-10 w-auto object-contain" />
                </div>
                <div>
                    <h1 class="font-bold text-slate-100 text-base sm:text-lg">جامعة العين العراقية</h1>
                    <p class="text-xs text-amber-400 font-medium">مكتب رئيس الجامعة · إدارة المهام والهيكل التنظيمي</p>
                </div>
            </div>
            <div class="flex items-center gap-3">
                <span class="text-xs text-slate-400 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg">
                    ✨ تموج المؤشر مفعل تلقائياً
                </span>
            </div>
        </div>
    </header>

    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <!-- ترحيب وإحصائيات سريعة -->
        <div class="p-6 rounded-2xl bg-gradient-to-r from-slate-900 to-sky-950 border border-amber-500/20 shadow-xl">
            <div class="text-xs text-amber-400 font-bold mb-1">جمهورية العراق · وزارة التعليم العالي والبحث العلمي</div>
            <h2 class="text-2xl font-black text-slate-100">لوحة تحكم مكتب رئيس الجامعة</h2>
            <p class="text-sm text-slate-400 mt-1 max-w-2xl">
                إدارة ومتابعة كافة الأوامر والتوجيهات الرئاسية والوزارية عبر كافة تشكيلات الجامعة وفق الهيكل المعتمد.
            </p>
        </div>

        <!-- بطاقات المؤشرات -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" id="statsContainer">
            <div class="p-5 rounded-xl bg-slate-900 border border-slate-800">
                <div class="text-xs text-slate-400">إجمالي التكليفات</div>
                <div class="text-3xl font-bold text-slate-100 mt-1" id="totalTasks">10</div>
            </div>
            <div class="p-5 rounded-xl bg-slate-900 border border-slate-800">
                <div class="text-xs text-slate-400">نسبة الإنجاز الكلية</div>
                <div class="text-3xl font-bold text-emerald-400 mt-1" id="completionRate">70%</div>
            </div>
            <div class="p-5 rounded-xl bg-slate-900 border border-slate-800">
                <div class="text-xs text-slate-400">تكليفات عاجلة وفورية</div>
                <div class="text-3xl font-bold text-rose-400 mt-1" id="urgentTasks">3</div>
            </div>
            <div class="p-5 rounded-xl bg-slate-900 border border-slate-800">
                <div class="text-xs text-slate-400">تشكيلات الجامعة</div>
                <div class="text-3xl font-bold text-purple-300 mt-1">70+</div>
            </div>
        </div>

        <!-- جدول المهام والتكليفات -->
        <div class="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <div class="flex items-center justify-between">
                <h3 class="text-lg font-bold text-slate-100">سجل التكليفات والمهام النشطة</h3>
                <span class="text-xs text-slate-400">محدث لحظياً عبر قاعدة بيانات SQLite</span>
            </div>
            <div class="overflow-x-auto">
                <table class="w-full text-right text-xs">
                    <thead class="bg-slate-950 text-slate-400 border-b border-slate-800">
                        <tr>
                            <th class="py-3 px-4">رمز التكليف</th>
                            <th class="py-3 px-4">عنوان المهمة</th>
                            <th class="py-3 px-4">الجهة المكلفة</th>
                            <th class="py-3 px-4">الأسبقية</th>
                            <th class="py-3 px-4">نسبة الإنجاز</th>
                            <th class="py-3 px-4">المرحلة</th>
                            <th class="py-3 px-4">الاستحقاق</th>
                        </tr>
                    </thead>
                    <tbody id="tasksTableBody" class="divide-y divide-slate-800 text-slate-300">
                        <!-- تُملأ بواسطة JavaScript من API بايثون -->
                    </tbody>
                </table>
            </div>
        </div>
    </main>

    <!-- كود تموج الماء التفاعلي بلغة JavaScript -->
    <script>
        const canvas = document.getElementById('waterRippleCanvas');
        const ctx = canvas.getContext('2d');
        let ripples = [];

        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();

        function addRipple(x, y, isClick = false) {
            ripples.push({
                x: x,
                y: y,
                radius: 0,
                maxRadius: isClick ? 120 : 65,
                alpha: isClick ? 0.6 : 0.3,
                speed: isClick ? 2.4 : 1.5
            });
            if (ripples.length > 50) ripples.shift();
        }

        let lastPos = { x: 0, y: 0, time: 0 };
        window.addEventListener('mousemove', (e) => {
            const now = Date.now();
            const dist = Math.hypot(e.clientX - lastPos.x, e.clientY - lastPos.y);
            if (dist > 15 || (dist > 5 && now - lastPos.time > 50)) {
                addRipple(e.clientX, e.clientY, false);
                lastPos = { x: e.clientX, y: e.clientY, time: now };
            }
        });

        window.addEventListener('click', (e) => {
            addRipple(e.clientX, e.clientY, true);
        });

        function animateRipples() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            for (let i = 0; i < ripples.length; i++) {
                const r = ripples[i];
                r.radius += r.speed;
                r.alpha *= 0.96;
                if (r.alpha > 0.01 && r.radius < r.maxRadius) {
                    ctx.beginPath();
                    ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
                    ctx.strokeStyle = \`rgba(212, 175, 55, \${r.alpha})\`; // لون التموج الذهبي لجامعة العين
                    ctx.lineWidth = 1.5;
                    ctx.stroke();
                }
            }
            requestAnimationFrame(animateRipples);
        }
        animateRipples();

        // جلب البيانات من بايثون Flask API
        async function loadData() {
            try {
                const res = await fetch('/api/tasks');
                const tasks = await res.json();
                const tbody = document.getElementById('tasksTableBody');
                tbody.innerHTML = '';
                tasks.forEach(t => {
                    const tr = document.createElement('tr');
                    tr.className = 'hover:bg-slate-800/40 transition-colors';
                    tr.innerHTML = \`
                        <td class="py-3 px-4 font-mono text-amber-400 font-bold">\${t.code}</td>
                        <td class="py-3 px-4 font-semibold text-slate-100">\${t.title}</td>
                        <td class="py-3 px-4 text-slate-300">\${t.target_node_name}</td>
                        <td class="py-3 px-4 \${t.priority === 'high_urgent' ? 'text-rose-400 font-bold' : 'text-slate-400'}">
                            \${t.priority === 'high_urgent' ? 'عاجل وفوري' : 'اعتيادي'}
                        </td>
                        <td class="py-3 px-4 font-mono">\${t.progress}%</td>
                        <td class="py-3 px-4">\${t.status}</td>
                        <td class="py-3 px-4 font-mono text-slate-400">\${t.due_date}</td>
                    \`;
                    tbody.appendChild(tr);
                });
            } catch (err) {
                console.log('Error loading tasks:', err);
            }
        }
        loadData();
    </script>
</body>
</html>
`;

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedFile(id);
    setTimeout(() => setCopiedFile(null), 2500);
  };

  const handleDownloadZip = async () => {
    setIsZipping(true);
    try {
      const zip = new JSZip();
      zip.file('app.py', pythonAppCode);
      zip.file('requirements.txt', requirementsTxt);
      zip.file('run_task_system.bat', setupBatScript);
      
      const templatesFolder = zip.folder('templates');
      templatesFolder?.file('index.html', templateHtml);

      const staticFolder = zip.folder('static')?.folder('assets');
      try {
        const alayenResp = await fetch('/assets/alayen_logo.png');
        if (alayenResp.ok) {
          const alayenBlob = await alayenResp.blob();
          staticFolder?.file('alayen_logo.png', alayenBlob);
        }
        const minResp = await fetch('/assets/ministry_logo.svg');
        if (minResp.ok) {
          const minText = await minResp.text();
          staticFolder?.file('ministry_logo.svg', minText);
        }
      } catch (e) {
        console.warn('Assets bundling warning:', e);
      }

      const readmeContent = `# منظومة إدارة المهام - مكتب رئيس جامعة العين العراقية (AUIQ)
المسار المستهدف للحفظ:
${targetPath}

## طريقة التشغيل السريعة:
1. فك ضغط هذا الملف مباشرة داخل المسار:
   ${targetPath}
2. انقر نقراً مزدوجاً على ملف:
   run_task_system.bat
3. سيقوم السكربت تلقائياً بتثبيت المتطلبات وتشغيل السيرفر وفتح الموقع في متصفحك على:
   http://localhost:5000

## المميزات:
- يعمل بلغة بايثون الحديثة (Python 3.9+ مع Flask و SQLite)
- متجاوب للعمل على الحواسيب، الأجهزة اللوحية، والهواتف
- خطوط عربية جميلة (Cairo, Tajawal, Amiri)
- تموج مائي سلس للمؤشر (Interactive Cursor Ripple)
- قاعدة بيانات كاملة لتشكيلات جامعة العين العراقية والمهام الرئاسية
`;
      zip.file('README.md', readmeContent);

      const blob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'AUIQ_Task_Management_Python.zip';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Failed to create zip', err);
    } finally {
      setIsZipping(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Dedicated to User Request */}
      <div className="rounded-2xl bg-gradient-to-r from-slate-950 via-slate-900 to-emerald-950 border border-emerald-500/30 p-6 sm:p-8 space-y-4 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs text-emerald-400 font-bold">
              <FolderCheck className="w-4 h-4" />
              <span>جاهز للحفظ في مسارك المحلي المخصص</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-100 tracking-tight">
              مشروع بايثون الكامل (Python Backend & Database)
            </h1>
            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              تم بناء منظومة متكاملة بلغة بايثون مع قاعدة بيانات SQLite وتصميم عصري جداً متجاوب مع كافة الأجهزة وتموج مائي تفاعلي عند تحريك المؤشر.
            </p>
          </div>

          <button
            onClick={handleDownloadZip}
            disabled={isZipping}
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-slate-950 font-extrabold text-xs shadow-lg shadow-emerald-500/25 active:scale-95 transition-all whitespace-nowrap self-start md:self-auto"
          >
            <Download className="w-4 h-4 stroke-[2.5]" />
            <span>{isZipping ? 'جاري تجميع الملفات...' : 'تنزيل حزمة بايثون كاملة (ZIP)'}</span>
          </button>
        </div>

        {/* User Local Path Highlight */}
        <div className="p-3 bg-slate-950/80 rounded-xl border border-emerald-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 text-slate-300">
            <span className="text-emerald-400 font-bold">المسار المحدد للحفظ:</span>
            <code className="font-mono text-amber-300 bg-slate-900 px-2 py-0.5 rounded border border-slate-800 text-[11px] select-all">
              {targetPath}
            </code>
          </div>
          <button
            onClick={() => handleCopy(targetPath, 'path')}
            className="text-slate-400 hover:text-emerald-400 font-semibold flex items-center gap-1 text-[11px] self-end sm:self-auto"
          >
            {copiedFile === 'path' ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">تم نسخ المسار</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>نسخ المسار</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-900 rounded-xl border border-slate-800 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('instructions')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg transition-colors ${
            activeTab === 'instructions'
              ? 'bg-emerald-500 text-slate-950 font-bold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Play className="w-3.5 h-3.5" />
          <span>الخطوات خطوة بخطوة للتشغيل</span>
        </button>

        <button
          onClick={() => setActiveTab('script')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg transition-colors ${
            activeTab === 'script'
              ? 'bg-emerald-500 text-slate-950 font-bold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Terminal className="w-3.5 h-3.5" />
          <span>ملف التشغيل التلقائي (run.bat)</span>
        </button>

        <button
          onClick={() => setActiveTab('app')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg transition-colors ${
            activeTab === 'app'
              ? 'bg-emerald-500 text-slate-950 font-bold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <FileCode className="w-3.5 h-3.5" />
          <span>كود بايثون الكامل (app.py)</span>
        </button>

        <button
          onClick={() => setActiveTab('html')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg transition-colors ${
            activeTab === 'html'
              ? 'bg-emerald-500 text-slate-950 font-bold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Code2 className="w-3.5 h-3.5" />
          <span>واجهة الويب والتموج (index.html)</span>
        </button>

        <button
          onClick={() => setActiveTab('requirements')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg transition-colors ${
            activeTab === 'requirements'
              ? 'bg-emerald-500 text-slate-950 font-bold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Code2 className="w-3.5 h-3.5" />
          <span>المكتبات (requirements.txt)</span>
        </button>
      </div>

      {/* Content Panels */}
      {activeTab === 'instructions' && (
        <div className="rounded-xl bg-slate-900 border border-slate-800 p-6 space-y-6">
          <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>دليل التشغيل خطوة بخطوة على حاسوبك (Windows):</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center text-xs">
                1
              </div>
              <h3 className="text-xs font-bold text-slate-200">تنزيل حزمة الملفات</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                انقر على زر "تنزيل حزمة بايثون كاملة (ZIP)" في الأعلى للحصول على ملف الأرشيف الجاهز بكافة أكواد البايثون وقواعد البيانات.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center text-xs">
                2
              </div>
              <h3 className="text-xs font-bold text-slate-200">فك الضغط في المسار المحدد</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                قم بفك ضغط الملفات داخل المجلد:
                <br />
                <code className="text-[10px] text-amber-300 font-mono break-all">{targetPath}</code>
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center text-xs">
                3
              </div>
              <h3 className="text-xs font-bold text-slate-200">التشغيل بنقرة واحدة</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                انقر نقراً مزدوجاً على الملف:
                <br />
                <strong className="text-emerald-400 text-xs">run_task_system.bat</strong>
                <br />
                سيقوم تلقائياً بتثبيت المكتبات، تهيئة SQLite وفتح الموقع فورياً في متصفحك!
              </p>
            </div>
          </div>

          <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 text-xs space-y-2 text-slate-300">
            <div className="font-bold text-amber-400 flex items-center gap-1.5">
              <Laptop className="w-4 h-4" />
              <span>العمل على كافة الأجهزة (الهواتف والآيباد والأجهزة الأخرى):</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              عند تشغيل السيرفر، يمكنك فتح المنظومة من هاتفك أو أي جهاز على نفس شبكة الواي فاي من خلال كتابة عنوان الآي بي الخاص بحاسوبك متبوعاً بالمنفذ 5000 (مثال: <code className="text-emerald-400 font-mono">http://192.168.1.50:5000</code>).
            </p>
          </div>
        </div>
      )}

      {activeTab === 'script' && (
        <div className="rounded-xl bg-slate-900 border border-slate-800 p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs text-emerald-400 font-bold">run_task_system.bat</span>
            <button
              onClick={() => handleCopy(setupBatScript, 'bat')}
              className="flex items-center gap-1 px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 transition-colors"
            >
              {copiedFile === 'bat' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedFile === 'bat' ? 'تم النسخ' : 'نسخ الكود'}</span>
            </button>
          </div>
          <pre className="p-4 rounded-lg bg-slate-950 text-slate-300 text-xs font-mono overflow-x-auto select-all leading-relaxed text-left" dir="ltr">
            {setupBatScript}
          </pre>
        </div>
      )}

      {activeTab === 'app' && (
        <div className="rounded-xl bg-slate-900 border border-slate-800 p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs text-emerald-400 font-bold">app.py</span>
            <button
              onClick={() => handleCopy(pythonAppCode, 'app')}
              className="flex items-center gap-1 px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 transition-colors"
            >
              {copiedFile === 'app' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedFile === 'app' ? 'تم النسخ' : 'نسخ الكود'}</span>
            </button>
          </div>
          <pre className="p-4 rounded-lg bg-slate-950 text-slate-300 text-xs font-mono overflow-x-auto select-all leading-relaxed text-left max-h-[600px]" dir="ltr">
            {pythonAppCode}
          </pre>
        </div>
      )}

      {activeTab === 'html' && (
        <div className="rounded-xl bg-slate-900 border border-slate-800 p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs text-emerald-400 font-bold">templates/index.html (مع كود التموج المائي للمؤشر)</span>
            <button
              onClick={() => handleCopy(templateHtml, 'html')}
              className="flex items-center gap-1 px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 transition-colors"
            >
              {copiedFile === 'html' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedFile === 'html' ? 'تم النسخ' : 'نسخ الكود'}</span>
            </button>
          </div>
          <pre className="p-4 rounded-lg bg-slate-950 text-slate-300 text-xs font-mono overflow-x-auto select-all leading-relaxed text-left max-h-[600px]" dir="ltr">
            {templateHtml}
          </pre>
        </div>
      )}

      {activeTab === 'requirements' && (
        <div className="rounded-xl bg-slate-900 border border-slate-800 p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs text-emerald-400 font-bold">requirements.txt</span>
            <button
              onClick={() => handleCopy(requirementsTxt, 'req')}
              className="flex items-center gap-1 px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 transition-colors"
            >
              {copiedFile === 'req' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedFile === 'req' ? 'تم النسخ' : 'نسخ الكود'}</span>
            </button>
          </div>
          <pre className="p-4 rounded-lg bg-slate-950 text-slate-300 text-xs font-mono overflow-x-auto select-all leading-relaxed text-left" dir="ltr">
            {requirementsTxt}
          </pre>
        </div>
      )}
    </div>
  );
};
