(() => {
  "use strict";

  const TIME_ZONE = "Asia/Shanghai";
  const WEEKDAY_ORDER = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const MONTHS_EN = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];
  const ZH_WEEKDAY_FULL = {
    Sunday: "星期日", Monday: "星期一", Tuesday: "星期二", Wednesday: "星期三",
    Thursday: "星期四", Friday: "星期五", Saturday: "星期六",
  };

  // ---------- i18n ----------
  const I18N = {
    zh: {
      signIn: "登录", signOut: "退出", signInBtn: "登录", signUpBtn: "注册", resetBtn: "重置密码",
      tzLabel: "北京时间 (UTC+8)",
      fullscreenTip: "全屏", fullscreenTipExit: "退出全屏",
      dataBtn: "数据", dataTip: "导入 / 导出数据",
      langTip: "切换语言",
      moreExport: "导出数据…",
      moreImport: "导入数据…", importRunning: "正在导入…",
      importDone: "导入完成：共 {n} 条", importSkipped: "，忽略 {n} 行无法识别的内容",
      importEmpty: "该文件里没有可导入的记录", importPickFile: "请选择 .csv 或 .xlsx 文件",
      importFailed: "导入失败",
      themeNowNext: "当前主题：{now} · 点击切到 {next}",
      moreLangToEn: "切换为英文", moreLangToZh: "切换为中文",
      fullscreenHint: '已进入全屏 · 按 <kbd>Esc</kbd> 或 <kbd>F11</kbd> 退出全屏',
      calendarBtn: "📅 日历", mealsBtn: "🍽 三餐",
      calendarTitle: "日历", mealsTitle: "三餐与身体数据",
      railGripTip: "拖动可交换左右位置",
      pagePrev: "第 1 页 · 今日锻炼、三餐、体重体脂",
      pageNext: "第 2 页 · 身体曲线与历史记录",
      pageDotPlan: "第 1 页 · 今日",
      pageDotBody: "第 2 页 · 曲线与历史",
      plan: "计划", editPlan: "✏ 编辑计划",
      futureNotice: "所选日期在未来，暂不可记录锻炼",
      backToToday: "回到今天",
      prevDayTip: "上一天",
      nextDayTip: "下一天",
      mealsDateTip: "打开日历选择日期",
      futureBlocked: "不能登记未来日期的记录",
      // plan modal
      planModalTitle: "计划编辑器", selectPlan: "选择计划（编辑已有）",
      planName: "计划名称", planNamePh: "输入计划名称",
      newBlankPlan: "＋ 新建空白计划", newBlankHint: "正在新建一份空白计划，点「保存」后才会创建。",
      pickPlanPlaceholder: "— 选择要编辑的计划 —",
      saveAsSuffix: " 副本",
      bindWeekday: "绑定星期（每周自动切换到该计划）", none: "不绑定",
      planItems: "计划项目", planItemPh: "计划项目…",
      tickerHint: "运动词条（点击加入计划，保存后生效）", tickerAddTip: "添加自定义词条",
      tickerNamePh: "运动名称，如：跑步 10km", tickerValuePh: "目标数值（可选）", tickerUnitPh: "单位（km/个/秒）",
      add: "添加", cancel: "取消", deletePlan: "删除此计划",
      save: "保存", saveChanges: "保存修改", saveAsNew: "另存为新计划",
      planSaved: "已保存计划：{x}", planSavedAs: "已另存为新计划：{x}", planCreated: "已新建计划：{x}",
      clearAll: "清空", restoreDefaults: "恢复默认",
      needLoginEdit: "请先登录后再编辑计划", needLoginTicker: "请先登录后再添加词条",
      addedToPlan: "已加入计划，保存后生效：{x}", tickerAdded: "已添加词条：{x}",
      confirmClearItems: "确定清空当前计划的全部项目吗？保存后生效。",
      confirmRestoreItems: "确定用默认项目覆盖当前编辑内容吗？保存后生效。",
      confirmClearTicker: "确定清空全部运动词条吗？包含系统默认词条。",
      confirmRestoreTicker: "确定恢复默认运动词条吗？你自己添加的词条会被移除。",
      itemsCleared: "已清空项目，保存后生效", itemsRestored: "已载入默认项目，保存后生效",
      noDefaultItems: "该计划没有可恢复的默认项目",
      tickerCleared: "已清空词条", tickerRestored: "已恢复默认词条",
      tickerResetFailed: "操作失败，请稍后重试",
      emptyPlan: "此计划暂无项目。",
      initFailure: "数据加载失败，请确认服务已启动后重试。",
      retry: "重试",
      // calendar
      today: "今天",
      legendDone: "已打卡",
      legendToday: "今天",
      streakLabel: "连续天数",
      totalLabel: "累计打卡",
      // countdown rail
      metroRailTitle: "倒计时", metroAddTip: "新增计时器",
      metroNewPill: "新计时器",
      metroName: "名称", metroNamePh: "留空则按时长命名",
      metroSound: "提示音", metroPreview: "试听",
      minutePh: "分", secondPh: "秒",
      metroMinN: "{n} 分钟", metroSecN: "{n} 秒", metroMinSec: "{m} 分 {s} 秒",
      metroRestartTip: "重新开始", metroPauseTip: "暂停", metroResumeTip: "继续", metroEditTip: "编辑", metroDeleteTip: "删除",
      metroPaused: "已暂停", metroEmpty: "暂无计时器",
      metroDurationErr: "请填写时长（1 秒 – 60 分钟）",
      metroNeedLogin: "请先登录后再管理倒计时",
      metroAudioBlocked: "浏览器已拦截声音，点击页面任意处即可播放提示音",
      confirmDeleteTimer: "确定删除倒计时「{x}」？",
      timerSaved: "已保存倒计时", timerDeleted: "已删除倒计时",
      soundChime: "三音叮咚", soundBell: "清铃", soundBeep: "电子蜂鸣",
      soundNetShort: "在线 · 短音", soundNetLong: "在线 · 长音",
      // auth modal
      email: "邮箱", password: "密码", passwordPh: "密码", passwordMinPh: "至少 6 位",
      code: "验证码", codePh: "6 位验证码", getCode: "获取验证码",
      forgotPassword: "忘记密码?", noAccount: "没有账号？注册", haveAccount: "已有账号？登录",
      newPassword: "新密码", backToSignIn: "返回登录",
      resendIn: "{n}s 后重发",
      enterEmail: "请输入邮箱", enterEmailPwd: "请输入邮箱和密码",
      fillAll: "请填写完整信息", fillSignup: "请填写邮箱、密码和验证码",
      sendFail: "发送失败", codeSent: "验证码已发送，请查收邮箱", devCode: "开发模式验证码：{x}",
      networkErr: "网络错误", loginFail: "登录失败", registerFail: "注册失败", resetFail: "重置失败",
      resetOk: "密码已重置，请登录", loginOk: "登录成功", registerOk: "注册成功", logoutOk: "已退出登录",
      savingStatus: "保存中…", savedStatus: "已保存", saveFailed: "保存失败，请重试",
      confirmDiscard: "有未保存的修改，确定放弃？",
      confirmSwitch: "有未保存的修改，切换计划将放弃，确定？",
      confirmDelete: "确定删除计划「{x}」？",
      confirmRenameAsNew: "改名保存会新建一份计划，原来的「{x}」仍会保留。继续？",
      untitledPlan: "未命名计划",
      planDeleted: "已删除计划：{x}",
      weekdayTaken: "星期绑定已被「{x}」占用，新计划未绑定星期",
      // meals
      breakfast: "早餐", lunch: "午餐", dinner: "晚餐",
      mealCount: "{n} 项", mealCountOne: "{n} 项", mealAddPh: "点此添加…",
      // body stats
      bodyTitle: "身体数据", bodyRange7: "1 周", bodyRange14: "2 周", bodyRange30: "30 天",
      bodyRange60: "60 天", bodyRange90: "90 天", bodyRangeAll: "全部",
      bodyRangeTip: "按最近 N 个「有记录的日子」取窗口：天天记录时就是最近 N 天，断档几天会自动往前多取几天。",
      bodyWeight: "体重 (kg)",
      bodyFat: "体脂 (%)",
      bodySave: "记录", bodySaving: "保存中…",
      bodyDelete: "删除",
      bodyDeleteNothing: "该日期还没有记录",
      bodyOptional: "选填",
      bodyNeedValue: "两项都可以留空，但至少填写一项",
      bodyRangeErr: "体重需在 20–400 kg 之间，体脂需在 1–70 % 之间（留空表示不记该项）",
      bodySaved: "已记录 {d}", bodyDeleted: "已删除 {d}",
      bodySummary: "{n} 条记录", bodyLatest: "最新", bodyChange: "区间变化",
      bodyWeightName: "体重", bodyFatName: "体脂", bmiTargetName: "健康体重",
      bodyDeleteTip: "删除这天",
      bodyEditTip: "改完点 ✓ 保存，留空表示不改动",
      bmiLabel: "BMI",
      bmiNeedHeight: "在「设置 · 身体信息」中填写身高后显示 BMI",
      bmiLow: "偏低", bmiNormal: "标准", bmiOver: "超重", bmiObese: "肥胖",
      bmiDotTip: "BMI {v}",
      // 累计变化 + 目标进度（录入行右侧胶囊）
      bodyTrendTip: "当前区间累计变化：{d} 至 {to}",
      goalTitle: "目标体重与体脂",
      goalHint: "留空表示不设该项，两项都留空即清除目标。",
      goalWeight: "目标体重 (kg)",
      goalFat: "目标体脂 (%)",
      goalBmiQuick: "按 BMI 边界快选",
      goalBmiLow: "下限 18.5 · {v} kg",
      goalBmiHigh: "上限 24.0 · {v} kg",
      goalNoHeight: "先在「设置 · 身体信息」填写身高",
      goalSave: "保存目标",
      goalClear: "清除目标",
      goalSaved: "目标已保存",
      goalCleared: "已清除目标",
      goalNeedValue: "两项都可以留空，但至少填写一项（要清除请点「清除目标」）",
      goalBtn: "设置目标",
      goalBtnTip: "设定目标体重与体脂",
      goalLegendName: "目标体重",
      goalFatName: "目标体脂",
      goalRemain: "还差 {v}",
      goalReached: "已达成",
      goalEtaDays: "约 {n} 天",
      goalEtaWeeks: "约 {n} 周",
      goalEtaMonths: "约 {n} 个月",
      goalEtaYear: "1 年以上",
      goalStalled: "近期未在接近目标",
      goalNoRecord: "尚无记录",
      goalPaceTip: "近 {d} 天速度 {p}/周",
      goalNoPaceTip: "记录太少，暂无法按周速度估算",
      mealSuggestTip: "根据你以往的记录推荐", dismissSuggestion: "不再显示该推荐",
      // export dialog
      exportTitle: "导出历史数据",
      exportHint: "选择时间范围，导出锻炼、三餐与身体数据。JSON 便于分析，CSV 可用 Excel 打开。",
      exportStart: "起始日期", exportEnd: "结束日期",
      exportRange7: "近 7 天", exportRange30: "近 30 天", exportRangeMonth: "本月", exportRangeAll: "全部",
      exportFormat: "格式", exportRun: "下载",
      exportCount: "共 {n} 条记录", exportNone: "该范围内暂无记录",
      exportRunning: "正在导出…", exportReversed: "起始日期不能晚于结束日期",
      exportNeedLogin: "请先登录：未登录的记录只保存在本浏览器中",
      exportFailed: "导出失败", exportAuth: "该实例已开启访问密钥，请先登录",
      // account menu + settings
      accountTip: "账号", settings: "设置", settingsTitle: "设置",
      settingsAccount: "当前账号：", settingsLang: "语言", settingsTheme: "主题",
      settingsProfile: "身体信息", settingsGender: "性别", settingsHeight: "身高 (cm)",
      genderUnset: "未填写", genderMale: "男", genderFemale: "女",
      saveProfile: "保存资料", profileSaved: "资料已保存",
      heightRangeErr: "身高需在 50–250 cm 之间",
      themeDark: "深色", themeLight: "浅色", themeEye: "护眼", themeSystem: "跟随系统",
      settingsPassword: "修改密码", oldPasswordPh: "原密码", newPasswordPh: "新密码（至少 6 位）",
      savePassword: "保存新密码", passwordNeedBoth: "请填写原密码和新密码",
      passwordSaved: "密码已更新",
      // admin panel
      adminPanel: "后台管理", adminTitle: "后台管理",
      adminPwdNote: "密码以「盐 + SHA-256」哈希形式存储（salt:hash），数据库里永远没有明文，管理员也无法查看或还原。",
      adminColId: "ID", adminColUser: "用户名", adminColEmail: "邮箱", adminColCreated: "注册时间",
      adminColRole: "角色 / 状态", adminColPassword: "密码", adminColActions: "操作",
      adminStatTotal: "注册用户", adminStatToday: "今日新增", adminStatAdmins: "管理员", adminStatLocked: "已锁定",
      adminRoleAdmin: "管理员", adminRoleUser: "用户",
      adminStatusLocked: "已锁定", adminStatusNormal: "正常",
      adminLock: "锁定", adminUnlock: "解锁",
      adminMakeAdmin: "设为管理员", adminRemoveAdmin: "取消管理员",
      adminLoading: "加载中…", adminEmpty: "暂无用户",
      adminLoadFail: "加载失败，请重试", adminOpFailed: "操作失败，请重试",
      adminConfirmToggle: "确定切换 {x} 的管理员权限吗？",
      adminConfirmLock: "确定锁定用户 {x} 吗？锁定后该账号无法登录。",
      adminConfirmUnlock: "确定解锁用户 {x} 吗？",
    },
    en: {
      signIn: "Sign in", signOut: "Sign out", signInBtn: "Sign in", signUpBtn: "Sign up", resetBtn: "Reset password",
      tzLabel: "Beijing Time (UTC+8)",
      fullscreenTip: "Fullscreen", fullscreenTipExit: "Exit fullscreen",
      dataBtn: "Data", dataTip: "Import / export data",
      langTip: "Switch language",
      moreExport: "Export data…",
      moreImport: "Import data…", importRunning: "Importing…",
      importDone: "Imported {n} records", importSkipped: ", skipped {n} unrecognized rows",
      importEmpty: "No importable records found in that file", importPickFile: "Please pick a .csv or .xlsx file",
      importFailed: "Import failed",
      themeNowNext: "Theme: {now} · click for {next}",
      moreLangToEn: "Switch to English", moreLangToZh: "Switch to Chinese",
      fullscreenHint: 'Fullscreen · press <kbd>Esc</kbd> or <kbd>F11</kbd> to exit',
      calendarBtn: "📅 Calendar", mealsBtn: "🍽 Meals",
      calendarTitle: "Calendar", mealsTitle: "Meals & Body Stats",
      railGripTip: "Drag to swap sides",
      plan: "Plan", editPlan: "✏ Edit plan",
      futureNotice: "Selected date is in the future — logging is disabled",
      backToToday: "Back to today",
      prevDayTip: "Previous day",
      nextDayTip: "Next day",
      mealsDateTip: "Open the calendar to pick a date",
      futureBlocked: "Cannot log entries for a future date",
      planModalTitle: "Plan editor", selectPlan: "Select plan (to edit)",
      planName: "Plan name", planNamePh: "Enter plan name",
      newBlankPlan: "+ New blank plan", newBlankHint: "Creating a blank plan. It is saved only when you press Save.",
      pickPlanPlaceholder: "— pick a plan to edit —",
      saveAsSuffix: " copy",
      bindWeekday: "Bind weekday (auto-switch to this plan weekly)", none: "Not bound",
      planItems: "Plan items", planItemPh: "Plan item…",
      tickerHint: "Exercise presets (click to add to plan, saved on Save)", tickerAddTip: "Add custom preset",
      tickerNamePh: "Name, e.g. Run 10km", tickerValuePh: "Target value (optional)", tickerUnitPh: "Unit (km/reps/s)",
      add: "Add", cancel: "Cancel", deletePlan: "Delete plan",
      save: "Save", saveChanges: "Save changes", saveAsNew: "Save as new plan",
      planSaved: "Plan saved: {x}", planSavedAs: "Saved as new plan: {x}", planCreated: "Plan created: {x}",
      clearAll: "Clear", restoreDefaults: "Defaults",
      needLoginEdit: "Please sign in to edit plans", needLoginTicker: "Please sign in to add presets",
      addedToPlan: "Added to plan, saved on Save: {x}", tickerAdded: "Preset added: {x}",
      confirmClearItems: "Clear every item of this plan? Applied on Save.",
      confirmRestoreItems: "Replace the editor with this plan's default items? Applied on Save.",
      confirmClearTicker: "Clear all exercise presets, including the built-in ones?",
      confirmRestoreTicker: "Restore the built-in presets? Presets you added will be removed.",
      itemsCleared: "Items cleared — saved on Save", itemsRestored: "Default items loaded — saved on Save",
      noDefaultItems: "This plan has no default items to restore",
      tickerCleared: "Presets cleared", tickerRestored: "Default presets restored",
      tickerResetFailed: "That didn't work — please try again",
      emptyPlan: "No items defined for this plan.",
      initFailure: "Failed to load data. Check the server is running, then retry.",
      retry: "Retry",
      today: "Today",
      legendDone: "Done",
      legendToday: "Today",
      streakLabel: "day streak",
      totalLabel: "days total",
      metroRailTitle: "Countdowns", metroAddTip: "Add timer",
      metroNewPill: "New timer",
      metroName: "Name", metroNamePh: "Leave blank to name it by duration",
      metroSound: "Chime", metroPreview: "Preview",
      minutePh: "min", secondPh: "sec",
      metroMinN: "{n} min", metroSecN: "{n} sec", metroMinSec: "{m}m {s}s",
      metroRestartTip: "Restart", metroPauseTip: "Pause", metroResumeTip: "Resume", metroEditTip: "Edit", metroDeleteTip: "Delete",
      metroPaused: "Paused", metroEmpty: "No timers yet",
      metroDurationErr: "Enter a duration between 1 second and 60 minutes",
      metroNeedLogin: "Please sign in to manage countdowns",
      metroAudioBlocked: "The browser blocked audio — click anywhere to enable chimes",
      confirmDeleteTimer: 'Delete the "{x}" countdown?',
      timerSaved: "Countdown saved", timerDeleted: "Countdown deleted",
      soundChime: "Three-tone chime", soundBell: "Bell", soundBeep: "Beep",
      soundNetShort: "Online · short", soundNetLong: "Online · long",
      email: "Email", password: "Password", passwordPh: "Password", passwordMinPh: "At least 6 chars",
      code: "Code", codePh: "6-digit code", getCode: "Get code",
      forgotPassword: "Forgot password?", noAccount: "No account? Sign up", haveAccount: "Have an account? Sign in",
      newPassword: "New password", backToSignIn: "Back to sign in",
      resendIn: "Resend in {n}s",
      enterEmail: "Please enter an email", enterEmailPwd: "Please enter email and password",
      fillAll: "Please fill in all fields", fillSignup: "Please enter email, password and code",
      sendFail: "Send failed", codeSent: "Code sent, please check your inbox", devCode: "Dev mode code: {x}",
      networkErr: "Network error", loginFail: "Sign-in failed", registerFail: "Sign-up failed", resetFail: "Reset failed",
      resetOk: "Password reset, please sign in", loginOk: "Signed in", registerOk: "Signed up", logoutOk: "Signed out",
      savingStatus: "Saving…", savedStatus: "Saved", saveFailed: "Save failed — please retry",
      confirmDiscard: "You have unsaved changes. Discard?",
      confirmSwitch: "You have unsaved changes. Switch plan and discard?",
      confirmDelete: 'Delete plan "{x}"?',
      confirmRenameAsNew: 'Saving under a new name creates a second plan; "{x}" will be kept. Continue?',
      untitledPlan: "Untitled plan",
      planDeleted: "Plan deleted: {x}",
      weekdayTaken: 'Weekday binding taken by "{x}"; the new plan is not bound',
      breakfast: "Breakfast", lunch: "Lunch", dinner: "Dinner",
      mealCount: "{n} items", mealCountOne: "{n} item", mealAddPh: "Tap to add…",
      bodyTitle: "Body Stats", bodyRange7: "1 wk", bodyRange14: "2 wks", bodyRange30: "30 days",
      bodyRange60: "60 days", bodyRange90: "90 days", bodyRangeAll: "All",
      bodyRangeTip: "Each range covers the last N days that have records — the same as N calendar days when you log every day.",
      bodyWeight: "Weight (kg)",
      bodyFat: "Body fat (%)",
      bodySave: "Log", bodySaving: "Saving…",
      bodyDelete: "Delete",
      bodyDeleteNothing: "Nothing logged for this date",
      bodyOptional: "optional",
      bodyNeedValue: "Both fields are optional, but fill in at least one",
      bodyRangeErr: "Weight must be 20–400 kg and body fat 1–70 % (leave blank to skip)",
      bodySaved: "Logged {d}", bodyDeleted: "Deleted {d}",
      bodySummary: "{n} records", bodyLatest: "Latest", bodyChange: "Change",
      bodyWeightName: "Weight", bodyFatName: "Body fat", bmiTargetName: "Healthy weight",
      bodyDeleteTip: "Delete this day",
      bodyEditTip: "Edit and press ✓ — leave a field empty to keep it",
      bmiLabel: "BMI",
      bmiNeedHeight: "Add your height in Settings · Body info to see BMI",
      bmiLow: "Underweight", bmiNormal: "Normal", bmiOver: "Overweight", bmiObese: "Obese",
      bmiDotTip: "BMI {v}",
      bodyTrendTip: "Cumulative change from {d} to {to}",
      goalTitle: "Weight & body fat goals",
      goalHint: "Leave a field empty to skip it — empty both to clear the goals.",
      goalWeight: "Target weight (kg)",
      goalFat: "Target body fat (%)",
      goalBmiQuick: "Pick a BMI boundary",
      goalBmiLow: "Low 18.5 · {v} kg",
      goalBmiHigh: "High 24.0 · {v} kg",
      goalNoHeight: "Add your height in Settings · Body info first",
      goalSave: "Save goals",
      goalClear: "Clear goals",
      goalSaved: "Goals saved",
      goalCleared: "Goals cleared",
      goalNeedValue: "Both fields are optional, but fill in at least one (use Clear to remove goals)",
      goalBtn: "Set goal",
      goalBtnTip: "Set target weight and body fat",
      goalLegendName: "Goal weight",
      goalFatName: "Goal body fat",
      goalRemain: "{v} to go",
      goalReached: "Reached",
      goalEtaDays: "~{n} d",
      goalEtaWeeks: "~{n} wk",
      goalEtaMonths: "~{n} mo",
      goalEtaYear: "over a year",
      goalStalled: "not moving that way",
      goalNoRecord: "No records yet",
      goalPaceTip: "Last {d} days: {p} per week",
      goalNoPaceTip: "Too few records to estimate a weekly pace",
      mealSuggestTip: "Suggested from your history", dismissSuggestion: "Hide this suggestion",
      exportTitle: "Export history",
      exportHint: "Pick a date range to export workouts, meals and body stats. JSON analyses well, CSV opens in Excel.",
      exportStart: "From", exportEnd: "To",
      exportRange7: "Last 7 days", exportRange30: "Last 30 days", exportRangeMonth: "This month", exportRangeAll: "All",
      exportFormat: "Format", exportRun: "Download",
      exportCount: "{n} records", exportNone: "Nothing logged in this range",
      exportRunning: "Exporting…", exportReversed: "The start date is after the end date",
      exportNeedLogin: "Please sign in — guest data never leaves this browser",
      exportFailed: "Export failed", exportAuth: "This instance requires an API key — please sign in",
      pageNext: "Page 2 · Meals & body stats", pagePrev: "Page 1 · Workout plan",
      pageDotPlan: "Page 1 · Workout plan", pageDotBody: "Page 2 · Meals & body stats",
      accountTip: "Account", settings: "Settings", settingsTitle: "Settings",
      settingsAccount: "Signed in as ", settingsLang: "Language", settingsTheme: "Theme",
      settingsProfile: "Body info", settingsGender: "Gender", settingsHeight: "Height (cm)",
      genderUnset: "Not set", genderMale: "Male", genderFemale: "Female",
      saveProfile: "Save profile", profileSaved: "Profile saved",
      heightRangeErr: "Height must be 50–250 cm",
      themeDark: "Dark", themeLight: "Light", themeEye: "Eye care", themeSystem: "Follow system",
      settingsPassword: "Change password", oldPasswordPh: "Current password",
      newPasswordPh: "New password (min 6 chars)",
      savePassword: "Save new password", passwordNeedBoth: "Fill in both passwords",
      passwordSaved: "Password updated",
      // admin panel
      adminPanel: "Admin panel", adminTitle: "Admin panel",
      adminPwdNote: "Passwords are stored as salted SHA-256 hashes (salt:hash). Plaintext never touches the database, and admins cannot view or recover them.",
      adminColId: "ID", adminColUser: "Username", adminColEmail: "Email", adminColCreated: "Joined",
      adminColRole: "Role / Status", adminColPassword: "Password", adminColActions: "Actions",
      adminStatTotal: "Users", adminStatToday: "New today", adminStatAdmins: "Admins", adminStatLocked: "Locked",
      adminRoleAdmin: "Admin", adminRoleUser: "User",
      adminStatusLocked: "locked", adminStatusNormal: "active",
      adminLock: "Lock", adminUnlock: "Unlock",
      adminMakeAdmin: "Promote", adminRemoveAdmin: "Demote",
      adminLoading: "Loading…", adminEmpty: "No users",
      adminLoadFail: "Failed to load — try again", adminOpFailed: "Operation failed — try again",
      adminConfirmToggle: "Toggle admin rights for {x}?",
      adminConfirmLock: "Lock user {x}? They won't be able to sign in.",
      adminConfirmUnlock: "Unlock user {x}?",
    },
  };

  const LOCALE = {
    zh: { calHeaders: ["一", "二", "三", "四", "五", "六", "日"], calLabel: (y, m) => `${y}年${m}月` },
    en: { calHeaders: ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"], calLabel: (y, m) => `${MONTHS_EN[m - 1]} ${y}` },
  };

  let LANG = "zh";

  function t(key, vars) {
    let s = (I18N[LANG] && I18N[LANG][key]);
    if (s === undefined) s = I18N.zh[key];
    if (s === undefined) s = key;
    if (vars) {
      for (const k of Object.keys(vars)) s = s.replace(new RegExp(`\\{${k}\\}`, "g"), vars[k]);
    }
    return s;
  }

  function displayWeekday(enName) {
    return LANG === "zh" ? (ZH_WEEKDAY_FULL[enName] || enName) : enName;
  }

  const $ = (id) => document.getElementById(id);

  function applyLang(lang) {
    LANG = lang === "en" ? "en" : "zh";
    document.documentElement.lang = LANG === "zh" ? "zh-CN" : "en";
    localStorage.setItem("chronosfit_lang", LANG);

    document.querySelectorAll("[data-i18n]").forEach((el) => {
      el.textContent = t(el.getAttribute("data-i18n"));
    });
    document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
      el.setAttribute("placeholder", t(el.getAttribute("data-i18n-placeholder")));
    });
    document.querySelectorAll("[data-i18n-title]").forEach((el) => {
      el.setAttribute("title", t(el.getAttribute("data-i18n-title")));
    });
    document.querySelectorAll("[data-i18n-html]").forEach((el) => {
      el.innerHTML = t(el.getAttribute("data-i18n-html"));
    });

    $("fullscreen-btn").setAttribute("title", t(document.fullscreenElement ? "fullscreenTipExit" : "fullscreenTip"));
    syncTopBarButtons();

    // The settings dialog mirrors the same two switches.
    if ($("settings-lang")) $("settings-lang").value = LANG;
    if ($("settings-theme")) $("settings-theme").value = defaultTheme;

    refreshI18nDynamic();
  }

  function refreshI18nDynamic() {
    tick();
    if (calYear) renderCalendar(calYear, calMonth);
    paintStreak();
    renderMeals(lastMealLogs);
    renderPills();
    if ($("plan-weekday") && $("plan-weekday").options.length) {
      const v = $("plan-weekday").value;
      populateWeekdaySelect(v);
    }
    if (loaded) {
      renderPlan();
      applyBodyPlaceholders();
      const rows = bodyFiltered();
      renderBodyChart(rows);
      renderBodySummary(rows);
      renderBodyList(rows);
      renderBodyBmi();
      renderBodyTrend();
    }
  }

  async function setLang(lang) {
    applyLang(lang);
    if (isLoggedIn) {
      try {
        await fetch("/api/auth/language", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ language: LANG }),
        });
      } catch { /* ignore */ }
    }
  }

  async function toggleLang() {
    await setLang(LANG === "zh" ? "en" : "zh");
  }

  // ---------- Theme ----------
  // 四态：system（跟随系统）/ dark（深色）/ light（浅色）/ eye（护眼）。
  // 顶栏图标按 THEME_CYCLE 循环，游客与登录用户走同一条路：前者存 localStorage，
  // 后者同时写回账号。图标显示「当前落在屏幕上的那个主题」，title 说明下一次点击会切到哪。
  const THEME_MODES = ["system", "dark", "light", "eye"];
  // 顶栏图标的循环顺序：默认护眼起手，浅色 / 深色各一步可达，跟随系统放在最后。
  const THEME_CYCLE = ["eye", "light", "dark", "system"];
  const THEME_ICONS = { system: "🌗", dark: "🌙", light: "☀️", eye: "🍂" };
  const THEME_LABEL_KEYS = { system: "themeSystem", dark: "themeDark", light: "themeLight", eye: "themeEye" };
  const systemLightMQ = window.matchMedia("(prefers-color-scheme: light)");
  let defaultTheme = "eye";

  // system 由 prefers-color-scheme 落地成 light 或 dark。
  function resolveTheme(mode) {
    if (mode !== "system") return mode;
    return systemLightMQ.matches ? "light" : "dark";
  }

  function shownTheme() {
    return resolveTheme(defaultTheme);
  }

  function nextTheme() {
    return THEME_CYCLE[(THEME_CYCLE.indexOf(defaultTheme) + 1) % THEME_CYCLE.length];
  }

  function applyTheme() {
    const theme = shownTheme();
    // light 与 eye 同属浅色家族：组件的浅底适配规则都挂在 .light 上，.eye 只换一套色板。
    document.body.classList.toggle("light", theme === "light" || theme === "eye");
    document.body.classList.toggle("eye", theme === "eye");
    syncTopBarButtons();
    if ($("settings-theme")) $("settings-theme").value = defaultTheme;
  }

  function setDefaultTheme(mode) {
    defaultTheme = THEME_MODES.includes(mode) ? mode : "eye";
    applyTheme();
  }

  function initTheme() {
    setDefaultTheme(localStorage.getItem("chronosfit_theme") || "eye");
  }

  function persistTheme(mode) {
    if (isLoggedIn) {
      fetch("/api/auth/theme", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ theme: mode }),
      }).catch(() => {});
    }
    // 登录用户同样留一份本机副本：退出后立刻就是上一次看到的主题，
    // 不必等 /api/auth/me 回来，也不会闪一下。
    localStorage.setItem("chronosfit_theme", mode);
  }

  // 循环按「已存的偏好」走，不按落地出来的明暗走：跟随系统在浅色环境下点一下
  // 应该回到护眼，而不是被解释成「从浅色出发」而跳去深色。
  function cycleTheme() {
    const next = nextTheme();
    setDefaultTheme(next);
    persistTheme(next);
  }

  initTheme();

  // 跟随系统模式下，系统明暗变化时实时切换。
  systemLightMQ.addEventListener("change", () => applyTheme());

  // ---------- 首屏遮罩 ----------
  // 登录用户的主题要等 /api/auth/me 回来才知道，先画深色就会「闪一下」。
  // 初始数据落地前整页不绘制，只露出浏览器默认底色；超时兜底保证接口挂住时不会永远空白。
  function revealPage() {
    clearTimeout(revealTimer);
    document.documentElement.classList.add("ready");
  }
  const revealTimer = setTimeout(revealPage, 2500);

  // ---------- App state ----------
  let plans = {};
  let weekdayPlan = {};
  let currentDate = "";
  let currentPlan = "";
  let loaded = false;
  let isLoggedIn = false;
  let currentUser = null;
  let tickerItems = [];
  let calYear = 0;
  let calMonth = 0;
  let calendarDates = new Set();
  // 打卡统计缓存：{ current, best, total }，null 表示未登录 / 无数据。
  let streakData = null;
  let lastMealLogs = [];
  let defaultPlans = {};
  let mealSuggestions = {};
  let dismissedSuggestions = new Set();

  // ---------- Beijing time helpers ----------
  function bjParts(date = new Date()) {
    const parts = new Intl.DateTimeFormat("en-CA", {
      timeZone: TIME_ZONE,
      year: "numeric", month: "2-digit", day: "2-digit",
      weekday: "long", hour: "2-digit", minute: "2-digit", second: "2-digit",
      hour12: false,
    }).formatToParts(date);
    const get = (ty) => parts.find((p) => p.type === ty)?.value ?? "";
    return {
      year: +get("year"), month: +get("month"), day: +get("day"),
      weekday: get("weekday"),
      hour: get("hour").padStart(2, "0"),
      minute: get("minute").padStart(2, "0"),
      second: get("second").padStart(2, "0"),
    };
  }

  const toISO = ({ year, month, day }) =>
    `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

  function dateWithOffset({ year, month, day }, offsetDays) {
    const base = new Date(Date.UTC(year, month - 1, day, 12, 0, 0));
    base.setUTCDate(base.getUTCDate() + offsetDays);
    return bjParts(base);
  }

  function todayISO() {
    return toISO(bjParts());
  }

  function currentDateIsFuture() {
    return currentDate > todayISO();
  }

  function isoParts(iso) {
    return bjParts(new Date(Date.UTC(
      +iso.slice(0, 4), +iso.slice(5, 7) - 1, +iso.slice(8, 10), 12)));
  }

  // 两页各有一套时钟头（data-bind 标记），同一数据源同时刷新。
  function setAllClock(attr, value) {
    document.querySelectorAll(`[data-bind="${attr}"]`).forEach((el) => {
      el.textContent = value;
    });
  }

  // The top date line doubles as the "which day am I logging" indicator; the
  // calendar rail on the left shows the full month and drives it.
  function syncDateLine() {
    const viewing = !!currentDate && currentDate !== todayISO();
    const p = viewing ? isoParts(currentDate) : bjParts();
    const date = viewing ? currentDate : toISO(p);
    setAllClock("date", date);
    setAllClock("weekday", displayWeekday(p.weekday));
    $("hang-date").textContent = date;
    $("hang-weekday").textContent = displayWeekday(p.weekday);
    document.querySelectorAll(".back-today").forEach((btn) => {
      btn.style.display = viewing ? "inline-flex" : "none";
    });
  }

  // ---------- Clock ----------
  function tick() {
    const p = bjParts();
    const hms = `${p.hour}:${p.minute}:${p.second}`;
    setAllClock("time", hms);
    $("hang-time").textContent = hms;
    syncDateLine();
  }
  tick();
  setInterval(tick, 1000);

  // ---------- Auth ----------
  async function checkAuth() {
    const res = await fetch("/api/auth/me");
    const data = await res.json();
    isLoggedIn = !!data.user;
    currentUser = data.user;
    updateAuthUI();
    if (isLoggedIn && currentUser.language) applyLang(currentUser.language);
    if (isLoggedIn && currentUser.theme) setDefaultTheme(currentUser.theme);
  }

  function updateAuthUI() {
    setAccountMenu(false);
    const adminBtn = $("settings-admin-btn");
    if (adminBtn) {
      adminBtn.style.display = currentUser && currentUser.is_admin ? "inline-block" : "none";
    }
    if (isLoggedIn) {
      $("auth-open-btn").style.display = "none";
      $("auth-user").style.display = "flex";
      $("auth-username-display").textContent = currentUser.email || currentUser.username;
    } else {
      $("auth-open-btn").style.display = "inline-block";
      $("auth-user").style.display = "none";
    }
  }

  // ---------- Account menu + settings ----------
  function setAccountMenu(open) {
    const menu = $("auth-menu");
    const btn = $("auth-avatar-btn");
    if (!menu || !btn) return;
    menu.hidden = !open;
    btn.setAttribute("aria-expanded", open ? "true" : "false");
    if (open) setDataMenu(false);
  }

  // 顶部按钮的「状态镜像」：主题图标就是屏幕上正在显示的主题，语言按钮文字是点下去会切到的语言。
  // 两者的 title 都写清「下一次点击会发生什么」，让标签本身就是提示。
  // 跟随系统下「设置」与「屏幕上」不是一回事，所以主题文字要说清偏好正显示成什么。
  function themeLabel(mode) {
    const label = t(THEME_LABEL_KEYS[mode]);
    return mode === "system" ? `${label} · ${t(THEME_LABEL_KEYS[resolveTheme(mode)])}` : label;
  }

  function syncTopBarButtons() {
    const themeBtn = $("theme-btn");
    if (themeBtn) {
      const tip = t("themeNowNext", { now: themeLabel(defaultTheme), next: themeLabel(nextTheme()) });
      themeBtn.textContent = THEME_ICONS[shownTheme()];
      themeBtn.title = tip;
      themeBtn.setAttribute("aria-label", tip);
    }
    const langBtn = $("lang-btn");
    if (langBtn) {
      // 中文界面 → 按钮显示 EN（切去英文）；英文界面 → 按钮显示 中。
      langBtn.textContent = LANG === "zh" ? "EN" : "中";
      langBtn.title = t(LANG === "zh" ? "moreLangToEn" : "moreLangToZh");
    }
  }

  function setDataMenu(open) {
    const menu = $("data-menu");
    const btn = $("data-btn");
    if (!menu || !btn) return;
    menu.hidden = !open;
    btn.setAttribute("aria-expanded", open ? "true" : "false");
    if (open) setAccountMenu(false);
  }

  function setSettingsStatus(msg, cls) {
    const el = $("settings-status");
    el.textContent = msg || "";
    el.className = "settings-status" + (cls ? " " + cls : "");
  }

  function openSettingsModal() {
    $("settings-account").textContent = currentUser ? currentUser.email || currentUser.username : "";
    // 身体信息回填：登录用户存服务端，游客存 localStorage。
    const p = isLoggedIn ? { gender: currentUser.gender, height_cm: currentUser.height_cm } : guestProfileRead();
    $("settings-gender").value = p.gender || "";
    $("settings-height").value = p.height_cm != null ? String(p.height_cm) : "";
    $("settings-old-pwd").value = "";
    $("settings-new-pwd").value = "";
    setSettingsStatus("");
    // applyLang / applyTheme already mirror the two pickers on every change.
    $("settings-modal").showModal();
  }

  async function saveProfile() {
    const gender = $("settings-gender").value || null;
    const raw = $("settings-height").value.trim();
    let height_cm = null;
    if (raw !== "") {
      height_cm = Number(raw);
      if (!Number.isFinite(height_cm) || height_cm < 50 || height_cm > 250) {
        setSettingsStatus(t("heightRangeErr"), "error");
        return;
      }
    }
    if (!isLoggedIn) {
      // 合并写回：同一个 key 里还存着目标体重 / 目标体脂，整体覆盖会把它们抹掉。
      guestProfileWrite({ ...guestProfileRead(), gender, height_cm });
      setSettingsStatus(t("profileSaved"), "ok");
      renderBodyBmi();
      renderBodyChart(bodyFiltered());
      return;
    }
    try {
      const res = await fetch("/api/auth/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gender, height_cm }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setSettingsStatus(data.detail || t("saveFailed"), "error");
        return;
      }
      if (currentUser) { currentUser.gender = gender; currentUser.height_cm = height_cm; }
      setSettingsStatus(t("profileSaved"), "ok");
      renderBodyBmi();
      renderBodyChart(bodyFiltered());
    } catch {
      setSettingsStatus(t("networkErr"), "error");
    }
  }

  async function saveNewPassword() {
    const old_password = $("settings-old-pwd").value;
    const new_password = $("settings-new-pwd").value;
    if (!old_password || !new_password) {
      setSettingsStatus(t("passwordNeedBoth"), "error");
      return;
    }
    try {
      const res = await fetch("/api/auth/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ old_password, new_password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setSettingsStatus(data.detail || t("saveFailed"), "error");
        return;
      }
      $("settings-old-pwd").value = "";
      $("settings-new-pwd").value = "";
      setSettingsStatus(t("passwordSaved"), "ok");
    } catch {
      setSettingsStatus(t("networkErr"), "error");
    }
  }

  function setupAccountMenu() {
    $("auth-avatar-btn").addEventListener("click", (e) => {
      e.stopPropagation();
      setAccountMenu($("auth-menu").hidden);
    });
    document.addEventListener("click", (e) => {
      if (!$("auth-menu").hidden && !$("auth-user").contains(e.target)) setAccountMenu(false);
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") setAccountMenu(false);
    });
    $("auth-settings-btn").addEventListener("click", () => {
      setAccountMenu(false);
      openSettingsModal();
    });
  }

  // ---------- 顶栏：数据下拉 + 主题 / 语言独立按钮 ----------
  function setupTopBarButtons() {
    $("data-btn").addEventListener("click", (e) => {
      e.stopPropagation();
      setDataMenu($("data-menu").hidden);
    });
    document.addEventListener("click", (e) => {
      if (!$("data-menu").hidden && !$("data-wrap").contains(e.target)) setDataMenu(false);
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") setDataMenu(false);
    });
    $("data-export-btn").addEventListener("click", () => {
      setDataMenu(false);
      openExportModal();
    });
    $("data-import-btn").addEventListener("click", () => {
      setDataMenu(false);
      $("import-file").click();
    });
    $("import-file").addEventListener("change", (e) => importFromFile(e.target));

    $("theme-btn").addEventListener("click", cycleTheme);
    $("lang-btn").addEventListener("click", toggleLang);
  }

  async function importFromFile(input) {
    const file = input.files && input.files[0];
    input.value = ""; // let the same file be picked again next time
    if (!file) return;
    const name = (file.name || "").toLowerCase();
    if (!name.endsWith(".csv") && !name.endsWith(".xlsx")) {
      setStatus(t("importPickFile"), "error");
      return;
    }
    setStatus(t("importRunning"), "saving");
    const form = new FormData();
    form.append("file", file, file.name);
    try {
      const res = await fetch("/api/import", { method: "POST", body: form });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setStatus(data.detail ? `${t("importFailed")}: ${data.detail}` : t("importFailed"), "error");
        return;
      }
      const c = data.imported || {};
      const total = (c.workout || 0) + (c.custom || 0) + (c.meal || 0) + (c.body || 0);
      if (!total) {
        setStatus(t("importEmpty"), "error");
        return;
      }
      let msg = t("importDone", { n: total });
      if (data.skipped) msg += t("importSkipped", { n: data.skipped });
      setStatus(msg);
      reloadAll();
      loadBody();
    } catch {
      setStatus(t("importFailed"), "error");
    }
  }

  function setupSettingsModal() {
    const modal = $("settings-modal");
    $("settings-close").addEventListener("click", () => modal.close());
    modal.addEventListener("click", (e) => {
      if (e.target === e.currentTarget) modal.close();
    });
    $("settings-lang").addEventListener("change", (e) => setLang(e.target.value));
    $("settings-theme").addEventListener("change", (e) => {
      setDefaultTheme(e.target.value);
      persistTheme(e.target.value);
    });
    $("settings-save-profile").addEventListener("click", saveProfile);
    $("settings-save-pwd").addEventListener("click", saveNewPassword);
    $("settings-new-pwd").addEventListener("keydown", (e) => {
      if (e.key === "Enter") saveNewPassword();
    });
  }

  // ---------- Admin panel ----------
  function setAdminStatus(msg, cls) {
    const el = $("admin-status");
    el.textContent = msg || "";
    el.className = "admin-status" + (cls ? " " + cls : "");
  }

  async function loadAdminData() {
    setAdminStatus(t("adminLoading"));
    try {
      const [statsRes, usersRes] = await Promise.all([
        fetch("/api/admin/stats"),
        fetch("/api/admin/users"),
      ]);
      const stats = await statsRes.json().catch(() => ({}));
      const usersData = await usersRes.json().catch(() => ({}));
      if (!statsRes.ok || !usersRes.ok) {
        setAdminStatus(stats.detail || usersData.detail || t("adminLoadFail"), "error");
        return;
      }
      renderAdminStats(stats);
      renderAdminUsers(usersData.users || []);
      setAdminStatus("");
    } catch {
      setAdminStatus(t("adminLoadFail"), "error");
    }
  }

  function renderAdminStats(stats) {
    $("admin-stats").innerHTML = [
      [t("adminStatTotal"), stats.total],
      [t("adminStatToday"), stats.today_new],
      [t("adminStatAdmins"), stats.admins],
      [t("adminStatLocked"), stats.locked],
    ]
      .map(
        ([label, value]) =>
          `<div class="stat-card"><b>${value ?? 0}</b><span>${label}</span></div>`
      )
      .join("");
  }

  // 表格行用 createElement + textContent 渲染，杜绝用户名 / 邮箱里的 HTML 注入。
  function renderAdminUsers(users) {
    const tbody = $("admin-users");
    tbody.innerHTML = "";
    if (!users.length) {
      const tr = document.createElement("tr");
      const td = document.createElement("td");
      td.colSpan = 7;
      td.textContent = t("adminEmpty");
      tr.appendChild(td);
      tbody.appendChild(tr);
      return;
    }
    for (const u of users) {
      const tr = document.createElement("tr");

      const tdId = document.createElement("td");
      tdId.textContent = u.id;
      tr.appendChild(tdId);

      const tdUser = document.createElement("td");
      tdUser.textContent = u.username;
      tr.appendChild(tdUser);

      const tdEmail = document.createElement("td");
      tdEmail.textContent = u.email || "—";
      tr.appendChild(tdEmail);

      const tdCreated = document.createElement("td");
      tdCreated.className = "admin-created";
      tdCreated.textContent = (u.created_at || "").replace("T", " ").slice(0, 16);
      tr.appendChild(tdCreated);

      const tdRole = document.createElement("td");
      tdRole.textContent =
        (u.is_admin ? t("adminRoleAdmin") : t("adminRoleUser")) +
        (u.locked ? " · " + t("adminStatusLocked") : "");
      tr.appendChild(tdRole);

      const tdPwd = document.createElement("td");
      tdPwd.className = "admin-hash";
      const hash = u.password_hash || "";
      tdPwd.textContent = hash ? `${hash.slice(0, 18)}…` : "—";
      tdPwd.title = hash || "";
      tr.appendChild(tdPwd);

      const tdActions = document.createElement("td");
      tdActions.className = "admin-actions";

      const isSelf = currentUser && currentUser.id === u.id;
      const btnAdmin = document.createElement("button");
      btnAdmin.type = "button";
      btnAdmin.textContent = u.is_admin ? t("adminRemoveAdmin") : t("adminMakeAdmin");
      btnAdmin.disabled = !!isSelf;
      btnAdmin.addEventListener("click", () => adminToggleAdmin(u));
      tdActions.appendChild(btnAdmin);

      const btnLock = document.createElement("button");
      btnLock.type = "button";
      btnLock.textContent = u.locked ? t("adminUnlock") : t("adminLock");
      btnLock.disabled = !!isSelf;
      btnLock.addEventListener("click", () => adminToggleLock(u));
      tdActions.appendChild(btnLock);

      tr.appendChild(tdActions);
      tbody.appendChild(tr);
    }
  }

  async function adminToggleAdmin(user) {
    if (!confirm(t("adminConfirmToggle", { x: user.email || user.username }))) return;
    try {
      const res = await fetch(`/api/admin/users/${user.id}/toggle-admin`, { method: "POST" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) { setAdminStatus(data.detail || t("adminOpFailed"), "error"); return; }
      await loadAdminData();
    } catch {
      setAdminStatus(t("adminOpFailed"), "error");
    }
  }

  async function adminToggleLock(user) {
    const action = user.locked ? "unlock" : "lock";
    const confirmKey = action === "lock" ? "adminConfirmLock" : "adminConfirmUnlock";
    if (!confirm(t(confirmKey, { x: user.email || user.username }))) return;
    try {
      const res = await fetch(`/api/admin/users/${user.id}/${action}`, { method: "POST" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) { setAdminStatus(data.detail || t("adminOpFailed"), "error"); return; }
      await loadAdminData();
    } catch {
      setAdminStatus(t("adminOpFailed"), "error");
    }
  }

  function setupAdminModal() {
    const modal = $("admin-modal");
    $("admin-close").addEventListener("click", () => modal.close());
    modal.addEventListener("click", (e) => {
      if (e.target === e.currentTarget) modal.close();
    });
    $("settings-admin-btn").addEventListener("click", () => {
      $("settings-modal").close();
      modal.showModal();
      loadAdminData();
    });
  }

  function setAuthMsg(msg, cls) {
    const el = $("auth-msg");
    el.textContent = msg || "";
    el.className = "auth-msg" + (cls ? " " + cls : "");
  }

  function switchAuthView(view) {
    document.querySelectorAll("#auth-modal .auth-view").forEach((v) => {
      v.style.display = v.dataset.view === view ? "flex" : "none";
    });
    const titles = { signin: "signInBtn", signup: "signUpBtn", reset: "resetBtn" };
    $("auth-modal-title").textContent = t(titles[view] || "signInBtn");
    setAuthMsg("");
  }

  function openAuthModal(view) {
    switchAuthView(view || "signin");
    $("auth-modal").showModal();
  }

  function startResendCooldown(btn) {
    let sec = 60;
    btn.disabled = true;
    const label = () => (sec > 0 ? t("resendIn", { n: sec }) : t("getCode"));
    btn.textContent = label();
    const timer = setInterval(() => {
      sec -= 1;
      btn.textContent = label();
      if (sec <= 0) {
        clearInterval(timer);
        btn.disabled = false;
      }
    }, 1000);
  }

  async function sendCode(email, purpose, btn) {
    if (!email) { setAuthMsg(t("enterEmail"), "error"); return; }
    try {
      const res = await fetch("/api/auth/send-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, purpose }),
      });
      const data = await res.json();
      if (!res.ok) { setAuthMsg(data.detail || t("sendFail"), "error"); return; }
      startResendCooldown(btn);
      if (data.dev_code) {
        const codeInput = purpose === "register" ? $("signup-code") : $("reset-code");
        if (codeInput) codeInput.value = data.dev_code;
        setAuthMsg(t("devCode", { x: data.dev_code }), "ok");
      } else {
        setAuthMsg(t("codeSent"), "ok");
      }
    } catch {
      setAuthMsg(t("networkErr"), "error");
    }
  }

  async function afterAuthChange() {
    await checkAuth();
    loaded = true;
    await reloadPlans();
    reloadAll();
    loadTicker();
    loadTimers();
  }

  async function doSignIn() {
    const email = $("signin-email").value.trim();
    const password = $("signin-password").value;
    if (!email || !password) { setAuthMsg(t("enterEmailPwd"), "error"); return; }
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) { setAuthMsg(data.detail || t("loginFail"), "error"); return; }
      $("signin-password").value = "";
      await afterAuthChange();
      $("auth-modal").close();
      setStatus(t("loginOk"));
    } catch {
      setAuthMsg(t("networkErr"), "error");
    }
  }

  async function doSignUp() {
    const email = $("signup-email").value.trim();
    const password = $("signup-password").value;
    const code = $("signup-code").value.trim();
    if (!email || !password || !code) { setAuthMsg(t("fillSignup"), "error"); return; }
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, code, language: LANG }),
      });
      const data = await res.json();
      if (!res.ok) { setAuthMsg(data.detail || t("registerFail"), "error"); return; }
      $("signup-password").value = "";
      $("signup-code").value = "";
      await afterAuthChange();
      $("auth-modal").close();
      setStatus(t("registerOk"));
    } catch {
      setAuthMsg(t("networkErr"), "error");
    }
  }

  async function doReset() {
    const email = $("reset-email").value.trim();
    const code = $("reset-code").value.trim();
    const newPassword = $("reset-password").value;
    if (!email || !code || !newPassword) { setAuthMsg(t("fillAll"), "error"); return; }
    try {
      const res = await fetch("/api/auth/reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code, new_password: newPassword }),
      });
      const data = await res.json();
      if (!res.ok) { setAuthMsg(data.detail || t("resetFail"), "error"); return; }
      setAuthMsg(t("resetOk"), "ok");
      switchAuthView("signin");
      $("signin-email").value = email;
    } catch {
      setAuthMsg(t("networkErr"), "error");
    }
  }

  async function doLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    isLoggedIn = false;
    currentUser = null;
    updateAuthUI();
    applyLang(localStorage.getItem("chronosfit_lang") || "zh");
    // 退出后回到游客主题：本机存过的选择优先，没存过就是默认的护眼。
    initTheme();
    loaded = true;
    await reloadPlans();
    reloadAll();
    loadTicker();
    loadTimers();
    setStatus(t("logoutOk"));
  }

  // ---------- localStorage helpers for guest mode ----------
  function lsKey(section) {
    return `chronosfit_${section}_${currentDate}`;
  }

  function lsGet(section) {
    try { return JSON.parse(localStorage.getItem(lsKey(section)) || "[]"); }
    catch { return []; }
  }

  function lsSet(section, data) {
    localStorage.setItem(lsKey(section), JSON.stringify(data));
  }

  // ---------- Plans ----------
  function planWeekdayOf(name) {
    const entry = Object.entries(weekdayPlan).find(([, planName]) => planName === name);
    return entry ? entry[0] : "";
  }

  // Picks which plan to show; never moves the date, so first load stays on today
  // and the future-date lock only ever comes from an explicit calendar selection.
  // A binding can outlive the plan it names (delete from the modal leaves the weekday
  // row behind), so every lookup has to check the plan still exists.
  function usablePlan(name) {
    return name && plans[name] ? name : "";
  }

  // A day without its own plan inherits the previous day's, so the four default plans
  // keep cycling across the week instead of leaving Monday / Wednesday / Friday empty.
  function nearestPlanName(parts) {
    for (let i = 1; i <= 7; i++) {
      const d = dateWithOffset(parts, -i);
      const plan = usablePlan(weekdayPlan[d.weekday]);
      if (plan) return plan;
    }
    return "";
  }

  function defaultPlanForToday(todayParts) {
    return (
      usablePlan(weekdayPlan[todayParts.weekday]) ||
      nearestPlanName(todayParts) ||
      Object.keys(plans)[0] ||
      ""
    );
  }

  function populateSelect() {
    const sel = $("plan-select");
    sel.innerHTML = "";
    Object.keys(plans).forEach((name) => {
      const opt = document.createElement("option");
      opt.value = name;
      opt.textContent = name;
      sel.append(opt);
    });
    sel.value = currentPlan;
  }

  function renderPlan() {
    const itemsEl = $("items");
    const names = plans[currentPlan] || [];
    itemsEl.innerHTML = "";

    const future = currentDateIsFuture();
    document.querySelector(".workout-card").classList.toggle("locked", future);
    $("future-notice").style.display = future ? "block" : "none";

    if (!names.length) {
      itemsEl.classList.add("empty");
      itemsEl.textContent = t("emptyPlan");
      $("progress").textContent = "0/0";
      return;
    }

    itemsEl.classList.remove("empty");
    for (const name of names) {
      const li = document.createElement("li");
      li.className = "item";

      const label = document.createElement("label");
      const cb = document.createElement("input");
      cb.type = "checkbox";
      cb.dataset.name = name;

      const span = document.createElement("span");
      span.className = "name";
      span.textContent = name;

      label.append(cb, span);
      li.append(label);
      cb.addEventListener("change", () => handleToggle(li, cb));
      itemsEl.append(li);
    }
    updateProgress();
  }

  async function loadLogs() {
    if (!loaded) return;
    const res = await fetch(`/api/logs?log_date=${encodeURIComponent(currentDate)}`);
    const logs = await res.json();
    const done = new Set(logs.filter((l) => l.is_completed === 1).map((l) => l.item_name));
    document.querySelectorAll("#items .item").forEach((li) => {
      const cb = li.querySelector("input");
      const checked = done.has(cb.dataset.name);
      cb.checked = checked;
      li.classList.toggle("done", checked);
    });
    updateProgress();
  }

  function updateProgress() {
    const allItems = [...document.querySelectorAll("#items .item")];
    const total = allItems.length;
    const done = allItems.filter((li) => li.classList.contains("done")).length;
    $("progress").textContent = `${done}/${total}`;
    const pct = total > 0 ? (done / total) * 100 : 0;
    $("progress-bar").style.width = `${pct}%`;
    $("progress-bar-wrap").style.display = total > 0 ? "block" : "none";
  }

  // ---------- Toggle & save ----------
  function setStatus(msg, cls) {
    const el = $("save-status");
    el.textContent = msg;
    el.className = cls || "";
  }

  async function handleToggle(li, cb) {
    if (currentDateIsFuture()) {
      cb.checked = !cb.checked;
      li.classList.toggle("done", cb.checked);
      setStatus(t("futureBlocked"), "error");
      return;
    }
    const prev = cb.checked;
    cb.disabled = true;
    setStatus(t("savingStatus"), "saving");

    if (!isLoggedIn) {
      const logs = lsGet("workout_logs");
      const idx = logs.findIndex((l) => l.item_name === cb.dataset.name);
      if (idx >= 0) logs[idx].is_completed = cb.checked ? 1 : 0;
      else logs.push({ schedule_type: currentPlan, item_name: cb.dataset.name, is_completed: cb.checked ? 1 : 0 });
      lsSet("workout_logs", logs);
      li.classList.toggle("done", cb.checked);
      updateProgress();
      cb.disabled = false;
      setStatus(`${t("savedStatus")} ${new Date().toLocaleTimeString()}`);
      if (cb.checked) playToggleTone();
      return;
    }

    try {
      const res = await fetch("/api/toggle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          log_date: currentDate,
          schedule_type: currentPlan,
          item_name: cb.dataset.name,
          is_completed: cb.checked,
        }),
      });
      if (!res.ok) throw new Error(await res.text());
      li.classList.toggle("done", cb.checked);
      updateProgress();
      setStatus(`${t("savedStatus")} ${new Date().toLocaleTimeString()}`);
      if (cb.checked) playToggleTone();
    } catch {
      cb.checked = prev;
      li.classList.toggle("done", prev);
      setStatus(t("saveFailed"), "error");
    } finally {
      cb.disabled = false;
    }
  }

  // ---------- Fullscreen ----------
  function toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen?.().catch(() => {});
    } else {
      document.exitFullscreen?.();
    }
  }

  // ---------- Meals ----------
  const MEALS = [
    { key: "breakfast", labelKey: "breakfast" },
    { key: "lunch", labelKey: "lunch" },
    { key: "dinner", labelKey: "dinner" },
  ];

  async function loadMeals() {
    if (!loaded) return;
    let logs;
    if (isLoggedIn) {
      const res = await fetch(`/api/meals/logs?log_date=${encodeURIComponent(currentDate)}`);
      logs = await res.json();
      mealSuggestions = await (await fetch("/api/meals/recent?limit=3")).json();
    } else {
      logs = lsGet("meals");
      mealSuggestions = guestMealSuggestions();
    }
    lastMealLogs = logs;
    renderMeals(logs);
    // The inline meals and body panels both track the selected date, so every
    // date change refreshes them together.
    loadBody();
  }

  const GUEST_SUGGEST_DAYS = 14;

  /** Same ranking as /api/meals/recent, over the guest's own localStorage history. */
  function guestMealSuggestions() {
    const uses = new Map();
    const seenOrder = { breakfast: [], lunch: [], dinner: [] };
    const today = bjParts();
    for (let back = GUEST_SUGGEST_DAYS - 1; back >= 0; back--) {
      const date = toISO(dateWithOffset(today, -back));
      let rows = [];
      try { rows = JSON.parse(localStorage.getItem(`chronosfit_meals_${date}`) || "[]"); } catch { rows = []; }
      if (!Array.isArray(rows)) continue;
      rows.forEach((row) => {
        if (!row || !row.item_name || !seenOrder[row.meal]) return;
        const key = `${row.meal}/${row.item_name}`;
        uses.set(key, (uses.get(key) || 0) + 1);
        const order = seenOrder[row.meal];
        if (!order.includes(row.item_name)) order.push(row.item_name);
      });
    }
    const out = {};
    Object.entries(seenOrder).forEach(([meal, order]) => {
      out[meal] = order
        .sort((a, b) => uses.get(`${meal}/${b}`) - uses.get(`${meal}/${a}`))
        .slice(0, 3);
    });
    return out;
  }

  function renderMeals(logs) {
    MEALS.forEach((m) => {
      const mealLogs = logs.filter((l) => l.meal === m.key);
      const box = document.querySelector(`.meals-col[data-meal="${m.key}"] ul`);
      if (!box) return;
      box.innerHTML = "";
      mealLogs.forEach((l) => box.append(makeMealLi(m.key, l.item_name, l.is_completed === 1)));
      const logged = new Set(mealLogs.map((l) => l.item_name));
      suggestionsFor(m.key, logged).forEach((name) => box.append(makeMealSuggestLi(m.key, name)));
      box.append(makeMealAddRow(m.key));
      const countEl = document.querySelector(`[data-meal-count="${m.key}"]`);
      if (countEl) countEl.textContent = t(mealLogs.length === 1 ? "mealCountOne" : "mealCount", { n: mealLogs.length });
    });
  }

  function suggestionsFor(meal, logged) {
    return (mealSuggestions[meal] || []).filter(
      (name) => !logged.has(name) && !dismissedSuggestions.has(`${meal}/${name}`)
    );
  }

  async function checkMealSuggestion(meal, name) {
    if (isLoggedIn) {
      const headers = { "Content-Type": "application/json" };
      const add = await fetch("/api/meals/add", {
        method: "POST", headers,
        body: JSON.stringify({ log_date: currentDate, meal, item_name: name }),
      });
      if (!add.ok) return false;
      await fetch("/api/meals/toggle", {
        method: "POST", headers,
        body: JSON.stringify({ log_date: currentDate, meal, item_name: name, is_completed: true }),
      });
    } else {
      const items = lsGet("meals");
      const found = items.find((i) => i.meal === meal && i.item_name === name);
      if (found) found.is_completed = 1;
      else items.push({ meal, item_name: name, is_completed: 1 });
      lsSet("meals", items);
    }
    return true;
  }

  function makeMealSuggestLi(meal, name) {
    const li = document.createElement("li");
    li.className = "item meal-suggest";
    li.title = t("mealSuggestTip");

    const cb = document.createElement("input");
    cb.type = "checkbox";

    const label = document.createElement("span");
    label.className = "suggest-text";
    label.textContent = name;

    const rm = document.createElement("button");
    rm.type = "button";
    rm.className = "del";
    rm.textContent = "\u2715";
    rm.setAttribute("aria-label", t("dismissSuggestion"));

    li.append(cb, label, rm);

    cb.addEventListener("change", async () => {
      if (currentDateIsFuture()) { cb.checked = !cb.checked; setStatus(t("futureBlocked"), "error"); return; }
      cb.disabled = true;
      const ok = await checkMealSuggestion(meal, name);
      cb.disabled = false;
      if (!ok) { cb.checked = false; setStatus(t("saveFailed"), "error"); return; }
      setStatus(`${t("savedStatus")} ${new Date().toLocaleTimeString()}`);
      loadMeals();
    });

    rm.addEventListener("click", () => {
      dismissedSuggestions.add(`${meal}/${name}`);
      li.remove();
    });

    return li;
  }

  function makeMealLi(meal, name, done) {
    const li = document.createElement("li");
    li.className = "item" + (done ? " done" : "");

    const cb = document.createElement("input");
    cb.type = "checkbox";
    cb.checked = done;

    const inp = document.createElement("input");
    inp.type = "text";
    inp.className = "ctext";
    inp.value = name;
    inp.maxLength = 120;

    const del = document.createElement("button");
    del.type = "button";
    del.className = "del";
    del.textContent = "\u2715";

    li.append(cb, inp, del);

    cb.addEventListener("change", async () => {
      if (currentDateIsFuture()) { cb.checked = !cb.checked; setStatus(t("futureBlocked"), "error"); return; }
      cb.disabled = true;
      if (isLoggedIn) {
        try {
          const r = await fetch("/api/meals/toggle", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ log_date: currentDate, meal, item_name: name, is_completed: cb.checked }),
          });
          if (!r.ok) throw new Error();
          li.classList.toggle("done", cb.checked);
          setStatus(`${t("savedStatus")} ${new Date().toLocaleTimeString()}`);
        } catch {
          cb.checked = !cb.checked;
          setStatus(t("saveFailed"), "error");
        }
      } else {
        let items = lsGet("meals");
        const idx = items.findIndex((i) => i.meal === meal && i.item_name === name);
        if (idx >= 0) items[idx].is_completed = cb.checked ? 1 : 0;
        lsSet("meals", items);
        li.classList.toggle("done", cb.checked);
        setStatus(`${t("savedStatus")} ${new Date().toLocaleTimeString()}`);
      }
      cb.disabled = false;
    });

    inp.addEventListener("keydown", (e) => {
      if (e.key === "Enter") { e.preventDefault(); inp.blur(); }
    });
    inp.addEventListener("change", () => renameMealItem(meal, name, li));

    del.addEventListener("click", async () => {
      if (isLoggedIn) {
        await fetch(
          `/api/meals?log_date=${encodeURIComponent(currentDate)}&meal=${encodeURIComponent(meal)}&item_name=${encodeURIComponent(name)}`,
          { method: "DELETE" }
        );
      } else {
        let items = lsGet("meals");
        items = items.filter((i) => !(i.meal === meal && i.item_name === name));
        lsSet("meals", items);
      }
      loadMeals();
    });

    return li;
  }

  async function renameMealItem(meal, oldName, li) {
    const inp = li.querySelector(".ctext");
    const name = inp.value.trim();
    const done = li.classList.contains("done");
    if (!name) { inp.value = oldName; return; }
    if (name === oldName) return;

    if (isLoggedIn) {
      const headers = { "Content-Type": "application/json" };
      await fetch("/api/meals/add", {
        method: "POST", headers,
        body: JSON.stringify({ log_date: currentDate, meal, item_name: name }),
      });
      if (done) {
        await fetch("/api/meals/toggle", {
          method: "POST", headers,
          body: JSON.stringify({ log_date: currentDate, meal, item_name: name, is_completed: true }),
        });
      }
      await fetch(
        `/api/meals?log_date=${encodeURIComponent(currentDate)}&meal=${encodeURIComponent(meal)}&item_name=${encodeURIComponent(oldName)}`,
        { method: "DELETE" }
      );
    } else {
      let items = lsGet("meals");
      const idx = items.findIndex((i) => i.meal === meal && i.item_name === oldName);
      if (idx >= 0) items[idx].item_name = name;
      lsSet("meals", items);
    }
    loadMeals();
  }

  function makeMealAddRow(meal) {
    const li = document.createElement("li");
    li.className = "item add-row";

    const cb = document.createElement("input");
    cb.type = "checkbox";
    cb.disabled = true;

    const inp = document.createElement("input");
    inp.type = "text";
    inp.className = "ctext";
    inp.placeholder = t("mealAddPh");
    inp.maxLength = 120;

    li.append(cb, inp);

    inp.addEventListener("keydown", async (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        if (currentDateIsFuture()) { setStatus(t("futureBlocked"), "error"); return; }
        const name = inp.value.trim();
        if (!name) return;
        if (isLoggedIn) {
          const res = await fetch("/api/meals/add", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ log_date: currentDate, meal, item_name: name }),
          });
          if (!res.ok) return;
        } else {
          const items = lsGet("meals");
          if (!items.find((i) => i.meal === meal && i.item_name === name)) {
            items.push({ meal, item_name: name, is_completed: 0 });
            lsSet("meals", items);
          }
        }
        loadMeals();
      } else if (e.key === "Escape") {
        inp.value = "";
      }
    });

    return li;
  }

  // ---------- Body stats (weight / body fat) ----------
  const BODY_LS_KEY = "chronosfit_body_history";
  const CHART = { w: 380, h: 150, padL: 36, padR: 36, padT: 14, padB: 24 };
  const BODY_LIMITS = { weight: [20, 400], body_fat: [1, 70] };

  let bodyHistory = [];
  let bodyDays = 30;
  // 图例点击切换曲线显隐：体重 / 体脂 / 健康体重参考线各自独立。
  const chartVisible = { weight: true, fat: true, bmi: true };

  function bodyLsRead() {
    try { return JSON.parse(localStorage.getItem(BODY_LS_KEY) || "{}"); }
    catch { return {}; }
  }

  function bodyLsWrite(map) {
    localStorage.setItem(BODY_LS_KEY, JSON.stringify(map));
  }

  // 游客的身体信息（性别/身高）只存在本机；登录用户走 /api/auth/profile。
  const PROFILE_LS_KEY = "chronosfit_profile";

  function guestProfileRead() {
    try { return JSON.parse(localStorage.getItem(PROFILE_LS_KEY) || "{}") || {}; }
    catch { return {}; }
  }

  function guestProfileWrite(p) {
    localStorage.setItem(PROFILE_LS_KEY, JSON.stringify(p));
  }

  function profileHeightCm() {
    return isLoggedIn
      ? (currentUser && currentUser.height_cm) || null
      : guestProfileRead().height_cm || null;
  }

  /* BMI 按中国成人标准分档：偏低 <18.5 蓝 / 标准 18.5–23.9 绿 /
     超重 24.0–27.9 橙 / 肥胖 ≥28 红。图标是带色的圆点徽章，跟在数值后面。 */
  const BMI_BANDS = [
    { max: 18.5, cls: "low", key: "bmiLow" },
    { max: 24.0, cls: "normal", key: "bmiNormal" },
    { max: 28.0, cls: "over", key: "bmiOver" },
    { max: Infinity, cls: "obese", key: "bmiObese" },
  ];

  function bmiOf(weightKg, heightCm) {
    if (!weightKg || !heightCm) return null;
    const m = heightCm / 100;
    return weightKg / (m * m);
  }

  /* 体重轴上的参考线只画一条：用户自定义目标优先（「目标体重 x kg」），
     没设目标时退回 BMI 边界——超重（含肥胖）取 24.0 的体重，偏瘦取 18.5
     （与标准区间下限一致）；已在标准区间则不画。 */
  // 返回 { weight, label, name } 或 null。
  function weightRefLine() {
    const goal = bodyGoalTargets().weight;
    if (goal !== null) {
      return {
        weight: goal,
        label: `${t("goalLegendName")} ${goal.toFixed(1)} kg`,
        name: t("goalLegendName"),
      };
    }
    const height = profileHeightCm();
    if (!height) return null;
    const weight = bodyValueOn("weight");
    const bmi = bmiOf(weight, height);
    if (bmi === null) return null;
    const m = height / 100;
    const boundary = (bmiVal) => ({
      weight: bmiVal * m * m,
      label: `BMI ${bmiVal.toFixed(1)} · ${(bmiVal * m * m).toFixed(1)} kg`,
      name: t("bmiTargetName"),
    });
    if (bmi >= 24.0) return boundary(24.0);
    if (bmi < 18.5) return boundary(18.5);
    return null;
  }

  function renderBodyBmi() {
    const el = $("body-bmi");
    if (!el) return;
    const height = profileHeightCm();
    // 优先用当前查看日期的体重；没记录则沿用最近一次的数值。
    const weight = bodyValueOn("weight");
    const bmi = bmiOf(weight, height);
    if (bmi === null) {
      el.innerHTML = `<span class="bmi-hint">${t("bmiNeedHeight")}</span>`;
      return;
    }
    const band = BMI_BANDS.find((b) => bmi < b.max);
    el.innerHTML =
      `<span class="bmi-label">${t("bmiLabel")}</span>` +
      `<b class="bmi-value">${bmi.toFixed(1)}</b>` +
      `<span class="bmi-tag bmi-${band.cls}" title="${t("bmiDotTip", { v: bmi.toFixed(1) })}">` +
      `<i class="bmi-dot" aria-hidden="true"></i>${t(band.key)}</span>`;
  }

  function bodyNum(value) {
    if (value === null || value === undefined) return null;
    const s = typeof value === "string" ? value.trim() : value;
    if (s === "") return null;
    const n = Number(s);
    return Number.isFinite(n) ? n : null;
  }

  function timeMs(iso) {
    return Date.parse(`${iso}T12:00:00Z`);
  }

  function fmt1(v) {
    return v === null || v === undefined ? "—" : v.toFixed(1);
  }

  async function loadBody() {
    if (isLoggedIn) {
      const res = await fetch("/api/body/history");
      bodyHistory = await res.json();
    } else {
      const map = bodyLsRead();
      bodyHistory = Object.keys(map).sort().map((d) => ({
        log_date: d, weight: map[d].weight ?? null, body_fat: map[d].body_fat ?? null,
      }));
    }
    renderBody();
  }

  /* 精度窗口的起始日：取「最近 N 个有记录的日子」里最早的那一天，N = 右上角选的天数。
     按记录日数而不是日历天数，是因为断档时日历窗口会把大半周切掉——
     8/25 开始记录、8/30 和 8/31 没记，选 1 周就只剩 9/1 起的三个点。
     天天记录时两种算法完全等价；记录日数不足 N 则一条都不砍。'' 表示不限。 */
  function bodyWindowCut() {
    if (!bodyDays) return "";
    const days = [...new Set(bodyHistory
      .filter((r) => r.log_date <= currentDate &&
        (bodyNum(r.weight) !== null || bodyNum(r.body_fat) !== null))
      .map((r) => r.log_date))].sort();
    if (!days.length) return "";
    return days.length > bodyDays ? days[days.length - bodyDays] : days[0];
  }

  // 卡片整体读作「截至查看日期的最近 N 个记录日」，所以右端也要收在 currentDate。
  function bodyFiltered() {
    const cut = bodyWindowCut();
    return bodyHistory.filter((r) =>
      (!cut || r.log_date >= cut) && r.log_date <= currentDate);
  }

  // Last recorded value of `key` on or before the viewed day — the number we carry
  // forward as the grey default. Returns null when the user never logged it.
  function bodyCarryForward(key, iso = currentDate) {
    let date = "";
    let value = null;
    bodyHistory.forEach((row) => {
      const v = bodyNum(row[key]);
      if (v === null || row.log_date > iso) return;
      if (row.log_date >= date) {
        date = row.log_date;
        value = v;
      }
    });
    return value;
  }

  // 目标体重 / 目标体脂：登录用户随账号存在 users 表，游客存在本机 profile。
  function bodyGoalTargets() {
    if (isLoggedIn && currentUser) {
      return {
        weight: bodyNum(currentUser.target_weight),
        fat: bodyNum(currentUser.target_body_fat),
      };
    }
    const p = guestProfileRead();
    return { weight: bodyNum(p.target_weight), fat: bodyNum(p.target_body_fat) };
  }

  async function writeBodyGoals(weight, body_fat) {
    if (!isLoggedIn) {
      guestProfileWrite({ ...guestProfileRead(), target_weight: weight, target_body_fat: body_fat });
      return true;
    }
    const res = await fetch("/api/body/target", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ weight, body_fat }),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setGoalStatus(data.detail || t("saveFailed"), true);
      return false;
    }
    if (currentUser) {
      currentUser.target_weight = weight;
      currentUser.target_body_fat = body_fat;
    }
    return true;
  }

  // 该指标在查看日期的值：当天没记录就沿用最近一次，和 BMI 行同一规则。
  function bodyValueOn(key) {
    return bodyCarryForward(key, currentDate);
  }

  /* 累计变化：只在右上角当前精度窗口内取首末两条记录，窗口外的一律不看。
     选「全部」时即从首条记录算到查看日期。窗口内不足两天谈不上变化，返回 null。 */
  function bodyCumulative(key) {
    const cut = bodyWindowCut();
    let first = null;
    let last = null;
    bodyHistory.forEach((row) => {
      const v = bodyNum(row[key]);
      if (v === null || row.log_date > currentDate) return;
      if (cut && row.log_date < cut) return;
      if (first === null) first = { date: row.log_date, value: v };
      last = { date: row.log_date, value: v };
    });
    if (!first || last.date === first.date) return null;
    return { delta: last.value - first.value, from: first.date, to: last.date };
  }

  function isoDiffDays(from, to) {
    return Math.round((timeMs(to) - timeMs(from)) / 86400000);
  }

  /* 周速度：直接复用「区间变化」的首末两条记录，和左侧 ▼/▲ 数字完全同源——
     选 1 周就是这 7 个记录日的平均速度，选 30 天就是这 30 个记录日的。
     窗口内不足两天算不出速度，返回 null。 */
  function bodyPacePerWeek(key) {
    const c = bodyCumulative(key);
    if (!c) return null;
    const days = isoDiffDays(c.from, c.to);
    if (days < 1) return null;
    return { perWeek: (c.delta / days) * 7, days };
  }

  /* 用「还差多少」除以「一周的变化量」得到周数，再按量级换成天 / 周 / 月。
     速度与目标同向（或在原地踏步）时不给估算——那时该说的是没进展。 */
  function estimateGoalEta(need, perWeek) {
    if (!perWeek || Math.abs(perWeek) < 0.05) return { stalled: true };
    if (need * perWeek >= 0) return { stalled: true };
    const weeks = Math.abs(need / perWeek);
    const days = weeks * 7;
    if (days < 14) return { text: t("goalEtaDays", { n: Math.max(1, Math.round(days)) }) };
    if (weeks < 26) return { text: t("goalEtaWeeks", { n: Math.round(weeks) }) };
    if (weeks < 52) return { text: t("goalEtaMonths", { n: Math.round(weeks / 4.345) }) };
    return { text: t("goalEtaYear") };
  }

  // 单个目标在查看日期的进度：{ state, label, tip }，label 直接上胶囊，tip 收全部细节。
  function goalProgress(key, target, name) {
    const unit = key === "weight" ? " kg" : " %";
    const current = bodyValueOn(key);
    const parts = [`${t(key === "weight" ? "goalLegendName" : "goalFatName")} ${target.toFixed(1)}${unit}`];
    if (current === null) {
      return { label: `${name} ${t("goalNoRecord")}`, tip: parts.join(" · ") };
    }
    parts.push(`${t("bodyLatest")} ${current.toFixed(1)}${unit}`);
    const need = current - target;
    // 已到或已越过目标线（need ≤ 0）都算达成——别再把「减过头」误判成停滞。
    if (need <= 0.05) {
      return { label: `${name} ${t("goalReached")}`, tip: parts.join(" · "), done: true };
    }
    const pace = bodyPacePerWeek(key);
    if (!pace) parts.push(t("goalNoPaceTip"));
    else parts.push(t("goalPaceTip", {
      d: pace.days,
      p: `${pace.perWeek > 0 ? "+" : ""}${pace.perWeek.toFixed(1)}${unit}`,
    }));
    const remain = `${name} ${t("goalRemain", { v: Math.abs(need).toFixed(1) + unit })}`;
    const eta = pace ? estimateGoalEta(need, pace.perWeek) : null;
    if (eta && eta.stalled) parts.push(t("goalStalled"));
    return {
      label: eta && eta.text ? `${remain} · ${eta.text}` : remain,
      tip: parts.join(" · "),
    };
  }

  // 降 = 绿色向下箭头，升 = 红色向上箭头；持平只留数字，不加箭头。
  function deltaSpan(c, unit) {
    if (!c) return "";
    const cls = c.delta < 0 ? "down" : c.delta > 0 ? "up" : "flat";
    const arrow = c.delta < 0 ? "\u25bc" : c.delta > 0 ? "\u25b2" : "";
    return `<span class="bd-cd ${cls}" title="${t("bodyTrendTip", { d: c.from, to: c.to })}">` +
      `${arrow}${Math.abs(c.delta).toFixed(1)} ${unit}</span>`;
  }

  const GOAL_ICON = "\ud83c\udfaf";

  function renderBodyTrend() {
    const el = $("body-trend");
    if (!el) return;
    const parts = [];
    const trend = deltaSpan(bodyCumulative("weight"), "kg")
      + deltaSpan(bodyCumulative("body_fat"), "%");
    if (trend) parts.push(`<span class="bd-chip bd-trend">${trend}</span>`);

    const goals = bodyGoalTargets();
    if (goals.weight === null && goals.fat === null) {
      parts.push(`<button type="button" class="bd-chip bd-goal" data-goal-btn` +
        ` title="${t("goalBtnTip")}">${GOAL_ICON} ${t("goalBtn")}</button>`);
    } else {
      [[goals.weight, "weight", t("bodyWeightName")], [goals.fat, "body_fat", t("bodyFatName")]]
        .forEach(([target, key, name]) => {
          if (target === null) return;
          const p = goalProgress(key, target, name);
          parts.push(`<button type="button" class="bd-chip bd-goal${p.done ? " done" : ""}"` +
            ` title="${p.tip}">${GOAL_ICON} ${p.label}</button>`);
        });
    }
    el.innerHTML = parts.join("");
  }

  function setGoalStatus(msg, isError) {
    const el = $("goal-status");
    if (!el) return;
    el.textContent = msg || "";
    el.className = "goal-status" + (msg ? (isError ? " error" : " ok") : "");
  }

  function bmiBoundaryWeight(bmi) {
    const height = profileHeightCm();
    if (!height) return null;
    const m = height / 100;
    return Math.round(bmi * m * m * 10) / 10;
  }

  // 快选按钮直接把边界体重写在标签上；没填身高时整组停用并说明原因。
  function syncGoalQuickPicks() {
    const low = bmiBoundaryWeight(18.5);
    const high = bmiBoundaryWeight(24.0);
    $("goal-bmi-low").textContent = t("goalBmiLow", { v: low === null ? "--" : low.toFixed(1) });
    $("goal-bmi-high").textContent = t("goalBmiHigh", { v: high === null ? "--" : high.toFixed(1) });
    $("goal-bmi-low").disabled = low === null;
    $("goal-bmi-high").disabled = high === null;
    const hint = $("goal-quick-hint");
    hint.hidden = low !== null;
    hint.textContent = t("goalNoHeight");
  }

  function openGoalModal() {
    const goals = bodyGoalTargets();
    $("goal-weight").value = goals.weight === null ? "" : String(goals.weight);
    $("goal-fat").value = goals.fat === null ? "" : String(goals.fat);
    syncGoalQuickPicks();
    setGoalStatus("");
    $("body-goal-modal").showModal();
    $("goal-weight").focus();
  }

  function readGoalFields() {
    const wRaw = $("goal-weight").value.trim();
    const fRaw = $("goal-fat").value.trim();
    return {
      weight: wRaw === "" ? null : bodyNum(wRaw),
      body_fat: fRaw === "" ? null : bodyNum(fRaw),
      empty: wRaw === "" && fRaw === "",
    };
  }

  async function saveGoals() {
    const { weight, body_fat, empty } = readGoalFields();
    if (empty) { setGoalStatus(t("goalNeedValue"), true); return; }
    if (outOfBodyRange(weight, body_fat)) { setGoalStatus(t("bodyRangeErr"), true); return; }
    if (await writeBodyGoals(weight, body_fat)) {
      setGoalStatus(t("goalSaved"));
      renderBodyTrend();
      renderBodyChart(bodyFiltered());
    }
  }

  async function clearGoals() {
    if (await writeBodyGoals(null, null)) {
      $("goal-weight").value = "";
      $("goal-fat").value = "";
      setGoalStatus(t("goalCleared"));
      renderBodyTrend();
      renderBodyChart(bodyFiltered());
    }
  }

  function applyBodyPlaceholders() {
    // 留空 = 不记这一项，是合法操作：没录过时提示「选填」；录过则把
    // 上次数值放进 placeholder，用户清空预填值后仍能看到参考。
    [["body-weight", "weight"], ["body-fat", "body_fat"]].forEach(([id, key]) => {
      const el = $(id);
      if (!el) return;
      const carried = bodyCarryForward(key);
      el.placeholder = carried === null ? t("bodyOptional") : String(carried);
    });
  }

  function renderBody() {
    const rows = bodyFiltered();
    const entry = bodyHistory.find((r) => r.log_date === currentDate);
    applyBodyPlaceholders();
    // 当天已有记录用当天值；否则把上次数值直接预填为默认值：
    // 点进输入框即等于输入了默认值，上下箭头也从它开始加减；
    // 清空输入框仍然表示「不记这一项」。
    $("body-weight").value = entry && bodyNum(entry.weight) !== null ? entry.weight
      : (bodyCarryForward("weight") ?? "");
    $("body-fat").value = entry && bodyNum(entry.body_fat) !== null ? entry.body_fat
      : (bodyCarryForward("body_fat") ?? "");
    renderBodyChart(rows);
    renderBodySummary(rows);
    renderBodyList(rows);
    renderBodyBmi();
    renderBodyTrend();
  }

  function seriesScale(rows, key, extra = []) {
    const vals = rows.map((r) => r[key]).filter((v) => v !== null && v !== undefined)
      .concat(extra.filter((v) => v !== null && v !== undefined));
    if (!vals.length) return null;
    let lo = Math.min(...vals);
    let hi = Math.max(...vals);
    if (lo === hi) { lo -= 1; hi += 1; }
    const pad = (hi - lo) * 0.18;
    return { lo: lo - pad, hi: hi + pad };
  }

  function renderBodyChart(rows) {
    const box = $("body-chart");
    const ref = weightRefLine();
    const fatGoal = bodyGoalTargets().fat;
    // 参考值并入各自纵轴范围，保证目标线 / 健康体重虚线始终落在绘图区内。
    const wScale = seriesScale(rows, "weight", ref ? [ref.weight] : []);
    const fScale = seriesScale(rows, "body_fat", fatGoal === null ? [] : [fatGoal]);

    if (!wScale && !fScale) {
      box.innerHTML = "";
      return;
    }

    const { w: baseW, h, padL, padR, padT, padB } = CHART;
    const w = box.clientWidth || baseW;
    const iw = w - padL - padR;
    const ih = h - padT - padB;

    const stamps = rows.map((r) => timeMs(r.log_date));
    const DAY = 86400000;
    let d0;
    let d1;
    /* 选 1 周 / 30 天等精度时横轴按窗口内首末记录铺开，右端补到查看日期：
       于是一屏之内「两天之间的像素宽度」恒定，只录了两三天也不会被拉伸铺满整张图。
       窗口是「最近 N 个记录日」，断档时跨度会大于 N 天，所以不能再按日历天数倒推左端。
       选「全部」时按数据首尾铺满。 */
    if (bodyDays) {
      d1 = Math.max(timeMs(currentDate), Math.max(...stamps));
      d0 = Math.min(...stamps);
      // 只有一两天的记录时给出最小跨度，否则点会贴死右端、日期标签也会叠在一起。
      if (d1 - d0 < 2 * DAY) d0 = d1 - 2 * DAY;
    } else {
      d0 = Math.min(...stamps);
      d1 = Math.max(...stamps);
      if (d0 === d1) { d0 -= DAY / 2; d1 += DAY / 2; }
    }
    const spanDays = Math.max(1, Math.round((d1 - d0) / DAY));

    const xOf = (iso) => padL + ((timeMs(iso) - d0) / (d1 - d0)) * iw;
    const yOf = (v, s) => padT + ih - ((v - s.lo) / (s.hi - s.lo)) * ih;

    const out = [];

    for (let i = 0; i <= 3; i++) {
      const y = (padT + (ih * i) / 3).toFixed(1);
      out.push(`<line class="bc-grid" x1="${padL}" y1="${y}" x2="${w - padR}" y2="${y}" />`);
    }
    out.push(`<line class="bc-axis" x1="${padL}" y1="${padT + ih}" x2="${w - padR}" y2="${padT + ih}" />`);

    /* 横轴固定等分成 6 段，末点必定落在窗口右端（也就是今天）：
       于是「两天之间的像素宽度」恒定，网格线与日期标签也不随数据疏密跳动。 */
    const SEGMENTS = 6;
    const tickDays = [];
    for (let i = 0; i <= SEGMENTS; i += 1) {
      const d = Math.round((spanDays * i) / SEGMENTS);
      if (!tickDays.includes(d)) tickDays.push(d);   // 跨度很小时等分会重合，去重
    }
    const ticks = tickDays.map((d) => d0 + d * DAY);
    const lastTick = ticks.length - 1;
    ticks.forEach((ms, i) => {
      const x = padL + ((ms - d0) / (d1 - d0)) * iw;
      if (i > 0) {
        out.push(`<line class="bc-grid bc-vgrid" x1="${x.toFixed(1)}" y1="${padT}" x2="${x.toFixed(1)}" y2="${padT + ih}" />`);
      }
      const label = new Date(ms).toISOString().slice(5, 10);
      const anchor = i === 0 ? "start" : (i === lastTick ? "end" : "middle");
      out.push(`<text class="bc-x" x="${x.toFixed(1)}" y="${h - 6}" text-anchor="${anchor}">${label}</text>`);
    });

    function plot(scale, key, cls, side, visible) {
      if (!scale) return;
      if (visible) {
        const pts = rows.filter((r) => r[key] !== null && r[key] !== undefined);
        const coords = pts.map((r) => `${xOf(r.log_date).toFixed(1)},${yOf(r[key], scale).toFixed(1)}`);
        if (coords.length > 1) {
          out.push(`<polyline class="bc-line ${cls}" points="${coords.join(" ")}" />`);
        }
        pts.forEach((r) => {
          out.push(
            `<circle class="bc-dot ${cls}" cx="${xOf(r.log_date).toFixed(1)}" cy="${yOf(r[key], scale).toFixed(1)}" r="3.2"` +
            ` data-date="${r.log_date}" role="button" tabindex="0" aria-label="${r.log_date}">` +
            `<title>${r.log_date} · ${r[key].toFixed(1)}${key === "weight" ? " kg" : " %"}</title></circle>`
          );
        });
      }
      const tx = side === "left" ? padL - 6 : w - padR + 6;
      const anchor = side === "left" ? "end" : "start";
      out.push(
        `<text class="bc-tick ${cls}" x="${tx}" y="${(padT + 4).toFixed(1)}" text-anchor="${anchor}">${scale.hi.toFixed(1)}</text>`,
        `<text class="bc-tick ${cls}" x="${tx}" y="${(padT + ih).toFixed(1)}" text-anchor="${anchor}">${scale.lo.toFixed(1)}</text>`
      );
    }

    // Weight reads on the left axis, body fat on the right.
    if (wScale) {
      plot(wScale, "weight", "bc-weight", "left", chartVisible.weight);
      out.push(`<text class="bc-unit" x="${padL - 6}" y="${(padT - 4).toFixed(1)}" text-anchor="end">kg</text>`);
    }
    if (fScale) {
      plot(fScale, "body_fat", "bc-fat", "right", chartVisible.fat);
      out.push(`<text class="bc-unit" x="${w - padR + 6}" y="${(padT - 4).toFixed(1)}" text-anchor="start">%</text>`);
    }

    // 体重参考线：绿色虚线，标签按来源写成「目标体重 …」或「BMI … · … kg」。
    if (ref && chartVisible.bmi && wScale) {
      const ty = yOf(ref.weight, wScale).toFixed(1);
      out.push(`<line class="bc-target" x1="${padL}" y1="${ty}" x2="${w - padR}" y2="${ty}" />`);
      out.push(
        `<text class="bc-target-label" x="${(w - padR - 4).toFixed(1)}" y="${(ty - 4).toFixed(1)}" text-anchor="end">` +
        `${ref.label}</text>`
      );
    }

    // 体脂目标：与体脂曲线同色的虚线，标注放在左端，避免和体重参考线标签叠在一起。
    if (fatGoal !== null && chartVisible.fat && fScale) {
      const fy = yOf(fatGoal, fScale).toFixed(1);
      out.push(`<line class="bc-target bc-target-fat" x1="${padL}" y1="${fy}" x2="${w - padR}" y2="${fy}" />`);
      out.push(
        `<text class="bc-target-label bc-target-fat" x="${(padL + 4).toFixed(1)}" y="${(fy - 4).toFixed(1)}" text-anchor="start">` +
        `${t("goalFatName")} ${fatGoal.toFixed(1)} %</text>`
      );
    }

    // 横轴刻度已在上方按固定窗口绘制，这里不再重复标注首尾日期。

    // 图例可点击切换对应曲线的显隐；隐藏时整项变灰。
    const legendItem = (series, cls, label) =>
      `<span class="bc-key ${cls}${chartVisible[series] ? "" : " off"}" data-series="${series}" role="button" tabindex="0">` +
      `<i class="bc-swatch"></i>${label}</span>`;
    let legend = `<div class="bc-legend">`;
    if (wScale) legend += legendItem("weight", "bc-weight", t("bodyWeightName"));
    if (fScale) legend += legendItem("fat", "bc-fat", t("bodyFatName"));
    if (ref) legend += legendItem("bmi", "bc-target-key", ref.name);
    legend += `</div>`;

    box.innerHTML =
      `<svg class="bc-svg" viewBox="0 0 ${w} ${h}" role="img" aria-label="${t("bodyTitle")}">` +
      out.join("") + `</svg>` + legend;
  }

  function renderBodySummary(rows) {
    const el = $("body-summary");
    if (!rows.length) { el.innerHTML = ""; return; }

    const latest = [...rows].reverse().find((r) => r.weight != null || r.body_fat != null) || {};
    const firstW = rows.find((r) => r.weight != null);
    const lastW = [...rows].reverse().find((r) => r.weight != null);
    const firstF = rows.find((r) => r.body_fat != null);
    const lastF = [...rows].reverse().find((r) => r.body_fat != null);

    function changeOf(firstR, lastR, key) {
      if (!firstR || !lastR || firstR === lastR) return "";
      const d = lastR[key] - firstR[key];
      const sign = d > 0 ? "+" : "";
      return `<span class="bc-delta ${d > 0 ? "up" : d < 0 ? "down" : ""}">${sign}${d.toFixed(1)}</span>`;
    }

    const wChange = changeOf(firstW, lastW, "weight");
    const fChange = changeOf(firstF, lastF, "body_fat");
    el.innerHTML =
      `<span class="bc-count">${t("bodySummary", { n: rows.length })}</span>` +
      `<span class="bc-stat">${t("bodyLatest")}: <b class="bc-weight">${fmt1(latest.weight)}</b> kg · ` +
      `<b class="bc-fat">${fmt1(latest.body_fat)}</b> %</span>` +
      (wChange || fChange
        ? `<span class="bc-stat">${t("bodyChange")}: ${wChange || "—"} kg / ${fChange || "—"} %</span>`
        : "");
  }

  function renderBodyList(rows) {
    const ul = $("body-list");
    ul.innerHTML = "";
    [...rows].reverse().slice(0, 8).forEach((r) => {
      const li = document.createElement("li");
      li.className = "body-row";

      const date = document.createElement("span");
      date.className = "bd-date";
      date.textContent = r.log_date;

      const edit = document.createElement("span");
      edit.className = "bd-edit";
      const wCell = bodyCell("kg", r.weight, BODY_LIMITS.weight);
      const fCell = bodyCell("%", r.body_fat, BODY_LIMITS.body_fat);
      edit.append(wCell.wrap, fCell.wrap);

      const save = document.createElement("button");
      save.type = "button";
      save.className = "bd-save";
      save.title = t("bodyEditTip");
      save.textContent = "\u2713";

      const commit = () => editBodyDay(r.log_date, wCell.input, fCell.input);
      save.addEventListener("click", commit);
      [wCell.input, fCell.input].forEach((inp) => {
        inp.addEventListener("keydown", (e) => {
          if (e.key === "Enter") { e.preventDefault(); commit(); }
        });
      });

      const del = document.createElement("button");
      del.type = "button";
      del.className = "del";
      del.title = t("bodyDeleteTip");
      del.textContent = "\u2715";
      del.addEventListener("click", () => deleteBodyDay(r.log_date));

      li.append(date, edit, save, del);
      ul.append(li);
    });
  }

  function bodyCell(unit, value, limits) {
    const wrap = document.createElement("label");
    wrap.className = "bd-field";

    const input = document.createElement("input");
    input.type = "number";
    input.className = "bd-input";
    input.step = "0.1";
    input.min = limits[0];
    input.max = limits[1];
    input.value = value === null || value === undefined ? "" : String(value);

    wrap.append(input, document.createTextNode(unit));
    return { wrap, input };
  }

  function outOfBodyRange(weight, body_fat) {
    return (weight !== null && (weight < BODY_LIMITS.weight[0] || weight > BODY_LIMITS.weight[1]))
      || (body_fat !== null && (body_fat < BODY_LIMITS.body_fat[0] || body_fat > BODY_LIMITS.body_fat[1]));
  }

  async function editBodyDay(iso, wIn, fIn) {
    const weight = bodyNum(wIn.value);
    const body_fat = bodyNum(fIn.value);
    if (wIn.value.trim() === "" && fIn.value.trim() === "") { setStatus(t("bodyNeedValue"), "error"); return; }
    if (outOfBodyRange(weight, body_fat)) { setStatus(t("bodyRangeErr"), "error"); return; }
    if (await writeBodyEntry(iso, weight, body_fat)) setStatus(t("bodySaved", { d: iso }));
  }

  async function saveBody() {
    if (currentDateIsFuture()) { setStatus(t("futureBlocked"), "error"); return; }
    const wRaw = $("body-weight").value.trim();
    const fRaw = $("body-fat").value.trim();
    // 留空 = 不记这一项（服务端 upsert 会保留旧值）；只有真正填了才校验范围。
    const weight = wRaw === "" ? null : bodyNum(wRaw);
    const body_fat = fRaw === "" ? null : bodyNum(fRaw);

    if (weight === null && body_fat === null) { setStatus(t("bodyNeedValue"), "error"); return; }
    if (outOfBodyRange(weight, body_fat)) { setStatus(t("bodyRangeErr"), "error"); return; }

    setStatus(t("bodySaving"), "saving");
    if (await writeBodyEntry(currentDate, weight, body_fat)) setStatus(t("bodySaved", { d: currentDate }));
  }

  // One upsert path for both the main form and the inline history rows: an omitted
  // value keeps what is already stored, server-side and in localStorage alike.
  async function writeBodyEntry(iso, weight, body_fat) {
    if (isLoggedIn) {
      const res = await fetch("/api/body", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ log_date: iso, weight, body_fat }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setStatus(data.detail || t("saveFailed"), "error");
        return false;
      }
    } else {
      const map = bodyLsRead();
      const prev = map[iso] || {};
      map[iso] = {
        weight: weight ?? prev.weight ?? null,
        body_fat: body_fat ?? prev.body_fat ?? null,
      };
      bodyLsWrite(map);
    }
    await loadBody();
    return true;
  }

  async function deleteBodyDay(iso) {
    if (isLoggedIn) {
      await fetch(`/api/body?log_date=${encodeURIComponent(iso)}`, { method: "DELETE" });
    } else {
      const map = bodyLsRead();
      delete map[iso];
      bodyLsWrite(map);
    }
    await loadBody();
    setStatus(t("bodyDeleted", { d: iso }));
  }

  // The chart now sits inline in the page flow, so its container always has a
  // measurable width: init() draws it once and the resize handler below keeps it
  // in sync (lastChartW guards against redrawing on every resize frame).
  let lastChartW = 0;
  let chartResizeTimer = null;

  function redrawBodyChart() {
    const box = $("body-chart");
    if (!box) return;
    const w = box.clientWidth;
    if (!w || w === lastChartW) return;
    lastChartW = w;
    renderBodyChart(bodyFiltered());
  }

  function setupBody() {
    $("body-range").querySelectorAll("button").forEach((btn) => {
      btn.addEventListener("click", () => {
        bodyDays = Number(btn.dataset.days);
        $("body-range").querySelectorAll("button").forEach((b) => b.classList.toggle("active", b === btn));
        renderBody();
      });
    });
    $("body-save").addEventListener("click", saveBody);
    // 删除当前查看日期的记录：与录入框同属一天，改完即可删。
    $("body-delete").addEventListener("click", () => {
      const entry = bodyHistory.find((r) => r.log_date === currentDate);
      if (!entry) { setStatus(t("bodyDeleteNothing"), "error"); return; }
      deleteBodyDay(currentDate);
    });
    // 胶囊随每次渲染重建，监听同样挂在容器上：点目标胶囊打开目标对话框。
    $("body-trend").addEventListener("click", (e) => {
      if (e.target.closest && e.target.closest(".bd-goal")) openGoalModal();
    });
    // 图表每次 render 都会替换 innerHTML，所以点击监听放在容器上做委托。
    // 点图例 = 切换对应曲线显隐；点线上的点 = 跳到那天的记录，
    // 录入框、BMI、历史列表全部随之联动。
    $("body-chart").addEventListener("click", (e) => {
      const legendKey = e.target.closest && e.target.closest(".bc-key");
      if (legendKey && legendKey.dataset.series) {
        chartVisible[legendKey.dataset.series] = !chartVisible[legendKey.dataset.series];
        renderBodyChart(bodyFiltered());
        return;
      }
      const dot = e.target.closest && e.target.closest("circle.bc-dot");
      if (!dot || !dot.dataset.date) return;
      navigateToDate(dot.dataset.date);
    });
    ["body-weight", "body-fat"].forEach((id) => {
      const input = $(id);
      input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") { e.preventDefault(); saveBody(); }
      });
      // 点入即全选：预填默认值后直接键入新值就是整体替换，
      // 不会被追加到旧值后面；点上下箭头不受选中状态影响。
      input.addEventListener("focus", () => input.select());
      input.addEventListener("click", () => input.select());
    });
    window.addEventListener("resize", () => {
      clearTimeout(chartResizeTimer);
      chartResizeTimer = setTimeout(redrawBodyChart, 150);
    });
  }

  // ---------- 目标对话框 ----------
  function setupGoalDialog() {
    const modal = $("body-goal-modal");
    $("goal-close").addEventListener("click", () => modal.close());
    modal.addEventListener("click", (e) => {
      if (e.target === e.currentTarget) modal.close();
    });
    $("goal-quick").addEventListener("click", (e) => {
      const btn = e.target.closest("button");
      if (!btn || btn.disabled) return;
      const weight = bmiBoundaryWeight(Number(btn.dataset.bmi));
      if (weight === null) return;
      $("goal-weight").value = String(weight);
      setGoalStatus("");
    });
    $("goal-save").addEventListener("click", saveGoals);
    $("goal-clear").addEventListener("click", clearGoals);
    ["goal-weight", "goal-fat"].forEach((id) => {
      const input = $(id);
      input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") { e.preventDefault(); saveGoals(); }
      });
      input.addEventListener("focus", () => input.select());
    });
  }

  // ---------- 悬浮顶栏 ----------
  // 固定定位，不参与文档流：显示紧凑时钟时不能把页面顶开。
  // 宽屏是整屏翻页（文档不滚动），所以要看当前页自身的 scrollTop；
  // 窄屏退回文档滚动，则看 window.scrollY。
  function setupScroll() {
    const sync = () => {
      const page = activePageEl();
      const inner = page ? page.scrollTop : 0;
      document.body.classList.toggle("scrolled", inner > 8 || window.scrollY > 8);
    };
    window.addEventListener("scroll", sync, { passive: true });
    // 元素自身的 scroll 不冒泡，用捕获阶段统一接收（页切换后依然有效）。
    document.addEventListener("scroll", sync, { passive: true, capture: true });
  }

  // ---------- Ticker ----------
  async function loadTicker() {
    const res = await fetch("/api/ticker");
    tickerItems = await res.json();
    renderTicker();
  }

  function renderTicker() {
    const track = $("ticker-track");
    track.innerHTML = "";
    tickerItems.forEach((item) => {
      const chip = document.createElement("span");
      chip.className = "ticker-chip";
      chip.textContent = item.label;
      chip.addEventListener("click", () => addFromTicker(item));
      track.append(chip);
    });
  }

  async function resetTicker(mode) {
    if (!isLoggedIn) {
      showToast(t("needLoginTicker"));
      return;
    }
    const label = mode === "clear" ? t("confirmClearTicker") : t("confirmRestoreTicker");
    if (!confirm(label)) return;
    const res = await fetch("/api/ticker/reset", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mode }),
    });
    if (!res.ok) {
      showToast(t("tickerResetFailed"));
      return;
    }
    const data = await res.json();
    tickerItems = data.items || [];
    renderTicker();
    showToast(t(mode === "clear" ? "tickerCleared" : "tickerRestored"));
  }

  function addFromTicker(item) {
    const name = item.label;
    keepPlanTailRow().value = name;
    const fresh = appendPlanRow("");
    fresh.focus();
    showToast(t("addedToPlan", { x: name }));
  }

  function showToast(msg) {
    const el = $("ticker-toast");
    el.textContent = msg;
    el.classList.add("show");
    setTimeout(() => el.classList.remove("show"), 2000);
  }

  function setupTickerAddForm() {
    $("ticker-add-btn").addEventListener("click", () => {
      const form = $("ticker-add-form");
      const visible = form.style.display !== "none";
      form.style.display = visible ? "none" : "flex";
    });

    $("ticker-cancel-add").addEventListener("click", () => {
      $("ticker-add-form").style.display = "none";
    });

    $("ticker-confirm-add").addEventListener("click", async () => {
      const name = $("ticker-label").value.trim();
      if (!name) return;
      const tv = parseFloat($("ticker-target").value) || 0;
      const tu = $("ticker-unit").value.trim();
      const label = tv > 0 ? `${name}${tv}${tu}` : name;
      if (!isLoggedIn) {
        showToast(t("needLoginTicker"));
        return;
      }
      await fetch("/api/ticker", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ label, target_value: tv, target_unit: tu }),
      });
      $("ticker-label").value = "";
      $("ticker-target").value = "";
      $("ticker-unit").value = "";
      $("ticker-add-form").style.display = "none";
      loadTicker();
      showToast(t("tickerAdded", { x: label }));
    });
  }

  // ---------- Calendar ----------
  function renderCalendar(year, month) {
    calYear = year;
    calMonth = month;
    const grid = $("cal-grid");
    grid.innerHTML = "";

    $("cal-month-label").textContent = LOCALE[LANG].calLabel(year, month);

    const headerRow = document.createElement("div");
    headerRow.className = "cal-header";
    LOCALE[LANG].calHeaders.forEach((h) => {
      const span = document.createElement("span");
      span.textContent = h;
      headerRow.append(span);
    });
    grid.append(headerRow);

    const firstDay = new Date(Date.UTC(year, month - 1, 1));
    let startDow = firstDay.getUTCDay();
    startDow = startDow === 0 ? 6 : startDow - 1;

    const daysInMonth = new Date(Date.UTC(year, month, 0)).getUTCDate();
    const daysInPrevMonth = new Date(Date.UTC(year, month - 1, 0)).getUTCDate();

    const todayISOStr = todayISO();

    const cells = [];
    for (let i = startDow - 1; i >= 0; i--) {
      cells.push({ day: daysInPrevMonth - i, other: true, date: null });
    }
    for (let d = 1; d <= daysInMonth; d++) {
      const iso = `${year}-${String(month).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
      cells.push({ day: d, other: false, date: iso });
    }
    const remaining = 7 - (cells.length % 7);
    if (remaining < 7) {
      for (let i = 1; i <= remaining; i++) {
        cells.push({ day: i, other: true, date: null });
      }
    }

    const row = document.createElement("div");
    row.className = "cal-row";
    cells.forEach((cell) => {
      const el = document.createElement("span");
      el.className = "cal-day";
      el.textContent = cell.day;

      if (cell.other) {
        el.classList.add("other-month");
      } else {
        if (cell.date === todayISOStr) el.classList.add("today");
        if (cell.date === currentDate) el.classList.add("selected");
        if (calendarDates.has(cell.date)) el.classList.add("has-log");
        el.addEventListener("click", () => navigateToDate(cell.date));
      }
      row.append(el);
    });
    grid.append(row);
  }

  function navigateToDate(iso) {
    currentDate = iso;
    const p = isoParts(iso);
    const plan = usablePlan(weekdayPlan[p.weekday]) || nearestPlanName(p);
    if (plan) {
      currentPlan = plan;
      $("plan-select").value = plan;
    }
    syncDateLine();
    renderPlan();
    loadLogs();
    loadMeals();
    renderCalendar(calYear, calMonth);
  }

  async function loadCalendarDates() {
    if (!calYear) return;
    const monthStr = `${calYear}-${String(calMonth).padStart(2, "0")}`;
    try {
      const res = await fetch(`/api/logs/calendar?month=${encodeURIComponent(monthStr)}`);
      const data = await res.json();
      calendarDates = new Set(data.dates);
    } catch {
      calendarDates = new Set();
    }
    renderCalendar(calYear, calMonth);
    loadStreak();
  }

  /* 月历下方的统计行：只填两个数字，标签由 HTML + i18n 提供。 */
  function paintStreak() {
    const bar = $("cal-streak");
    if (!bar) return;
    const s = streakData;
    if (!s || !s.total) { bar.hidden = true; return; }
    $("streak-current").textContent = String(s.current);
    $("streak-total").textContent = String(s.total);
    bar.hidden = false;
  }

  async function loadStreak() {
    try {
      const res = await fetch("/api/logs/streak");
      streakData = res.ok ? await res.json() : null;
    } catch {
      streakData = null;   // 未登录 / 拉取失败时不显示，避免留下空壳
    }
    paintStreak();
  }

  function calPrev() {
    let m = calMonth - 1;
    let y = calYear;
    if (m < 1) { m = 12; y--; }
    calYear = y; calMonth = m;
    loadCalendarDates();
  }

  function calNext() {
    let m = calMonth + 1;
    let y = calYear;
    if (m > 12) { m = 1; y++; }
    calYear = y; calMonth = m;
    loadCalendarDates();
  }

  function calGoTo(year, month) {
    calYear = year; calMonth = month;
    loadCalendarDates();
  }

  // ---------- Today ----------
  function goToday() {
    const todayParts = bjParts();
    currentPlan = defaultPlanForToday(todayParts);
    currentDate = toISO(todayParts);
    $("plan-select").value = currentPlan;
    syncDateLine();
    renderPlan();
    loadLogs();
    loadMeals();
    calGoTo(todayParts.year, todayParts.month);
  }

  // ---------- Countdown rail (interval timers) ----------
  const SOUNDS = [
    { key: "chime", nameKey: "soundChime" },
    { key: "bell", nameKey: "soundBell" },
    { key: "beep", nameKey: "soundBeep" },
    { key: "net-short", nameKey: "soundNetShort", url: "https://assets.mixkit.co/active_storage/sfx/1049/1049.wav" },
    { key: "net-long", nameKey: "soundNetLong", url: "https://assets.mixkit.co/active_storage/sfx/1039/1039.wav" },
  ];
  const MAX_TIMER_SEC = 3600;
  const FLASH_MS = 2000;
  const NEW_TIMER = "new";

  let actx = null;
  let audioUnlocked = false;
  const audioElements = new Map();
  let timers = [];
  let editingTimer = null;

  function ensureAudio() {
    if (!actx) actx = new (window.AudioContext || window.webkitAudioContext)();
    if (actx.state === "suspended") actx.resume();
    return actx;
  }

  function tone(freq, when, dur, vol, type) {
    const ctx = ensureAudio();
    const o = ctx.createOscillator();
    o.type = type || "sine";
    o.frequency.value = freq;
    const g = ctx.createGain();
    const time = ctx.currentTime + when;
    g.gain.setValueAtTime(0.0001, time);
    g.gain.exponentialRampToValueAtTime(vol, time + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, time + dur);
    o.connect(g).connect(ctx.destination);
    o.start(time);
    o.stop(time + dur + 0.05);
  }

  function synthTone(key) {
    try {
      if (key === "bell") {
        tone(880, 0, 1.4, 0.8);
        tone(1760, 0, 1.0, 0.2);
      } else if (key === "beep") {
        [0, 0.2, 0.4].forEach((when) => tone(1046.5, when, 0.14, 0.6, "square"));
      } else {
        tone(698.46, 0, 0.5, 0.9);
        tone(880.0, 0.3, 0.5, 0.9);
        tone(1174.66, 0.6, 0.7, 0.9);
      }
    } catch { /* ignore */ }
  }

  function soundByKey(key) {
    return SOUNDS.find((s) => s.key === key) || SOUNDS[0];
  }

  function onlinePlayer(url) {
    let el = audioElements.get(url);
    if (!el) {
      el = new Audio(url);
      el.preload = "auto";
      audioElements.set(url, el);
    }
    return el;
  }

  function showAudioHint() {
    const hint = $("metro-hint");
    hint.textContent = t("metroAudioBlocked");
    hint.style.display = "block";
  }

  function unlockAudio() {
    if (audioUnlocked) return;
    audioUnlocked = true;
    $("metro-hint").style.display = "none";
    try {
      ensureAudio();
      // Warm the remote chimes now that a gesture has happened, so the alert
      // sound is ready when a countdown elapses.
      SOUNDS.forEach((s) => { if (s.url) onlinePlayer(s.url).load(); });
    } catch { /* ignore */ }
  }

  function playChime(key) {
    if (!audioUnlocked) { showAudioHint(); return; }
    const sound = soundByKey(key);
    if (!sound.url) { synthTone(sound.key); return; }
    const player = onlinePlayer(sound.url);
    player.currentTime = 0;
    player.play().catch(() => synthTone("chime"));
  }

  // 勾选完成音：一短一长的上行两音（哔—棱）。刻意比倒计时提示音轻，
  // 因为它每勾一项就会响一次；也不走 playChime 的静音提示，那条文案属于倒计时。
  function playDoneTone() {
    try {
      tone(1046.5, 0, 0.1, 0.26, "triangle");
      tone(1567.98, 0.09, 0.42, 0.3, "sine");
    } catch { /* 浏览器不允许发声时静默跳过 */ }
  }

  function allItemsDone() {
    const boxes = [...document.querySelectorAll("#items .item input[type=checkbox]")];
    return boxes.length > 0 && boxes.every((b) => b.checked);
  }

  // 全部完成音：C-E-G-C 四音上行琶音（嘟嘟嘟嘟），末音拖长并叠一个高音收束，像游戏通关。
  // 一天只响一次，所以比 playDoneTone 更响。
  function playClearFanfare() {
    try {
      const notes = [523.25, 659.25, 783.99, 1046.5];
      notes.forEach((freq, i) => {
        const last = i === notes.length - 1;
        tone(freq, i * 0.13, last ? 0.6 : 0.14, 0.34, "triangle");
        if (last) tone(1567.98, 0.39, 0.55, 0.16, "sine");
      });
    } catch { /* 浏览器不允许发声时静默跳过 */ }
  }

  function playToggleTone() {
    if (allItemsDone()) playClearFanfare();
    else playDoneTone();
  }

  function formatMs(ms) {
    const total = Math.max(0, Math.ceil(ms / 1000));
    const m = String(Math.floor(total / 60)).padStart(2, "0");
    const s = String(total % 60).padStart(2, "0");
    return `${m}:${s}`;
  }

  function durationName(sec) {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    if (m && s) return t("metroMinSec", { m, s });
    if (m) return t("metroMinN", { n: m });
    return t("metroSecN", { n: s });
  }

  function timerName(timer) {
    return timer.label || durationName(timer.duration_sec);
  }

  function makePill(timer, index) {
    const pill = document.createElement("div");
    pill.className = "metro-pill";
    pill.dataset.index = String(index);
    if (timer.id) pill.dataset.timerId = String(timer.id);
    if (!timer.enabled) pill.classList.add("paused");

    const fill = document.createElement("span");
    fill.className = "pill-fill";

    const row = document.createElement("span");
    row.className = "pill-row";

    const text = document.createElement("span");
    text.className = "pill-text";
    const name = document.createElement("span");
    name.className = "pill-name";
    name.textContent = timerName(timer);
    const time = document.createElement("span");
    time.className = "pill-time";
    text.append(name, time);

    const btns = document.createElement("span");
    btns.className = "pill-btns";
    const owned = Boolean(timer.id);
    btns.append(
      pillButton("metroRestartTip", "restart", () => restartTimer(timer)),
      pillButton(timer.enabled ? "metroPauseTip" : "metroResumeTip", timer.enabled ? "pause" : "play",
        () => toggleTimer(timer)),
      // 访客的倒计时是只读种子数据，没有 id 可改；按钮照常显示，点击时引导登录，
      // 否则会被当成"按钮消失了"。
      pillButton("metroEditTip", "edit", () => {
        if (owned) openTimerEditor(timer.id);
        else requireMetroLogin();
      }),
      pillButton("metroDeleteTip", "close", () => {
        if (owned) deleteTimer(timer);
        else requireMetroLogin();
      }),
    );

    row.append(text, btns);
    pill.append(fill, row);
    return pill;
  }

  // Draft capsule shown while a brand-new timer is being defined.
  function makeNewTimerPill() {
    const pill = document.createElement("div");
    pill.className = "metro-pill is-new";
    const row = document.createElement("span");
    row.className = "pill-row";
    const text = document.createElement("span");
    text.className = "pill-text";
    const name = document.createElement("span");
    name.className = "pill-name";
    name.textContent = t("metroNewPill");
    text.append(name);
    row.append(text);
    pill.append(row);
    return pill;
  }

  // 图标必须是内联 SVG 而不是 ↺⏸✎✕ 这类 Unicode 字形：Arial 没有这几个字符，
  // 浏览器逐字回退到不同符号字体，基线和字身高度都不一样，一排四个必然错位。
  const PILL_ICONS = {
    restart: '<polyline points="1 4 1 10 7 10" /><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />',
    pause: '<line x1="9" y1="4.5" x2="9" y2="19.5" /><line x1="15" y1="4.5" x2="15" y2="19.5" />',
    play: '<path d="M6.5 4.8 19 12 6.5 19.2Z" />',
    edit: '<path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />',
    close: '<path d="M18 6 6 18" /><path d="m6 6 12 12" />',
  };

  function pillButton(tipKey, icon, onClick) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "pill-btn";
    btn.title = t(tipKey);
    btn.setAttribute("aria-label", btn.title);
    btn.innerHTML =
      `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" ` +
      `stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">${PILL_ICONS[icon] || ""}</svg>`;
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      onClick();
    });
    return btn;
  }

  function renderPills() {
    // The editor form lives inside the capsule being edited; park it back in the
    // rail before wiping so a re-render never destroys in-progress input.
    detachMetroPop();
    const box = $("metro-pills");
    box.innerHTML = "";
    if (!timers.length && editingTimer !== NEW_TIMER) {
      const empty = document.createElement("span");
      empty.className = "rail-empty";
      empty.textContent = t("metroEmpty");
      box.append(empty);
    }
    timers.forEach((timer, index) => box.append(makePill(timer, index)));
    if (editingTimer === NEW_TIMER) {
      mountEditorIn(box.appendChild(makeNewTimerPill()));
    } else if (editingTimer !== null) {
      const pill = pillForTimer(editingTimer);
      if (pill) mountEditorIn(pill);
      else editingTimer = null;
    }
    refreshPills();
  }

  function refreshPills() {
    const now = Date.now();
    document.querySelectorAll("#metro-pills .metro-pill").forEach((pill) => {
      const timer = timers[+pill.dataset.index];
      if (!timer) return;
      const total = timer.duration_sec * 1000;
      const remain = timer.enabled ? Math.max(0, timer.endsAt - now) : Math.min(total, timer.pausedRemain ?? total);
      pill.classList.toggle("paused", !timer.enabled);
      pill.classList.toggle("over", !!timer.flashUntil && now < timer.flashUntil);
      pill.querySelector(".pill-time").textContent = formatMs(remain);
      pill.querySelector(".pill-fill").style.width = `${total ? (remain / total) * 100 : 0}%`;
    });
  }

  function metroTick() {
    const now = Date.now();
    timers.forEach((timer) => {
      if (!timer.enabled) return;
      if (now < timer.endsAt) return;
      playChime(timer.sound_key);
      timer.flashUntil = now + FLASH_MS;
      timer.endsAt = now + timer.duration_sec * 1000;
    });
    refreshPills();
  }

  async function loadTimers() {
    try {
      const res = await fetch("/api/metronomes");
      const rows = await res.json();
      // 进入页面全部从头开跑——侧栏计时器的意义就是打开即用。
      // 服务器只存时长，暂停 / 启用状态不跨会话保留，回来一律重新计时。
      timers = rows.map((row) => {
        const total = row.duration_sec * 1000;
        return { ...row, enabled: 1, endsAt: Date.now() + total, pausedRemain: 0, flashUntil: 0 };
      });
    } catch {
      timers = [];
    }
    closeTimerEditor();
    renderPills();
  }

  async function patchTimer(timer, fields, onDone) {
    if (!timer.id) { onDone(); return; }
    const res = await fetch("/api/metronomes", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: timer.id, ...fields }),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setStatus(data.detail || t("saveFailed"), "error");
      loadTimers();
      return;
    }
    onDone();
  }

  // 重新开始：从头跑完整时长。与「继续」不同，继续是接着暂停处跑，重新开始一定重新计数，
  // 所以暂停状态下也要把 enabled 写回去，否则重置后仍停在满值不动。
  function restartTimer(timer) {
    const run = () => {
      timer.enabled = 1;
      timer.endsAt = Date.now() + timer.duration_sec * 1000;
      timer.pausedRemain = 0;
      timer.flashUntil = 0;
      renderPills();
    };
    if (timer.enabled) run();
    else patchTimer(timer, { enabled: true }, run);
  }

  function toggleTimer(timer) {
    const enabled = timer.enabled ? 0 : 1;
    patchTimer(timer, { enabled: !!enabled }, () => {
      if (enabled) {
        timer.endsAt = Date.now() + (timer.pausedRemain || timer.duration_sec * 1000);
        timer.pausedRemain = 0;
        timer.flashUntil = 0;
      } else {
        timer.pausedRemain = Math.max(0, timer.endsAt - Date.now());
      }
      timer.enabled = enabled;
      renderPills();
    });
  }

  function deleteTimer(timer) {
    if (!timer.id) return;
    if (!confirm(t("confirmDeleteTimer", { x: timerName(timer) }))) return;
    fetch(`/api/metronomes?metronome_id=${timer.id}`, { method: "DELETE" })
      .then(async (res) => {
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          setStatus(data.detail || t("saveFailed"), "error");
          return;
        }
        timers = timers.filter((x) => x !== timer);
        if (editingTimer === timer.id) closeTimerEditor();
        renderPills();
        setStatus(t("timerDeleted"));
      });
  }

  function populateSoundSelect(selected) {
    const sel = $("metro-pop-sound");
    sel.innerHTML = "";
    SOUNDS.forEach((sound) => {
      const opt = document.createElement("option");
      opt.value = sound.key;
      opt.textContent = t(sound.nameKey);
      sel.append(opt);
    });
    sel.value = SOUNDS.some((s) => s.key === selected) ? selected : SOUNDS[0].key;
  }

  function pillForTimer(id) {
    return [...document.querySelectorAll("#metro-pills .metro-pill")]
      .find((pill) => pill.dataset.timerId === String(id));
  }

  function detachMetroPop() {
    const pop = $("metro-pop");
    const rail = $("metro-rail");
    if (pop && rail && pop.parentElement !== rail) rail.append(pop);
  }

  // Editing happens inside the capsule itself, so it is obvious which timer the
  // form belongs to — the capsule stretches and hosts the fields.
  function mountEditorIn(pill) {
    document.querySelectorAll("#metro-pills .metro-pill.is-editing")
      .forEach((p) => p.classList.remove("is-editing"));
    pill.classList.add("is-editing");
    pill.append($("metro-pop"));
    $("metro-pop").style.display = "flex";
  }

  function removeNewTimerPill() {
    document.querySelectorAll("#metro-pills .metro-pill.is-new").forEach((p) => p.remove());
  }

  // 访客的倒计时只读：编辑/删除统一引导登录，和新建按钮走同一条路径。
  function requireMetroLogin() {
    setStatus(t("metroNeedLogin"), "error");
    openAuthModal("signin");
  }

  function openTimerEditor(target) {
    if (!isLoggedIn) {
      requireMetroLogin();
      return;
    }
    if (editingTimer === target) { closeTimerEditor(); return; }
    const timer = target === NEW_TIMER ? null : timers.find((x) => x.id === target);
    if (target !== NEW_TIMER && !timer) return;
    editingTimer = target;
    $("metro-pop-name").value = timer ? timer.label : "";
    $("metro-pop-min").value = timer ? Math.floor(timer.duration_sec / 60) || "" : "";
    $("metro-pop-sec").value = timer ? timer.duration_sec % 60 || "" : "";
    populateSoundSelect(timer ? timer.sound_key : "chime");
    $("metro-pop-save").textContent = t(timer ? "save" : "add");
    removeNewTimerPill();
    const pill = target === NEW_TIMER
      ? $("metro-pills").appendChild(makeNewTimerPill())
      : pillForTimer(target);
    if (pill) mountEditorIn(pill);
    $("metro-pop-min").focus();
  }

  function closeTimerEditor() {
    editingTimer = null;
    // Park the form in the rail first: the draft pill below may be carrying it,
    // and a detached node can no longer be found by id lookup.
    detachMetroPop();
    removeNewTimerPill();
    document.querySelectorAll("#metro-pills .metro-pill.is-editing")
      .forEach((p) => p.classList.remove("is-editing"));
    const pop = $("metro-pop");
    if (pop) pop.style.display = "none";
  }

  function popDurationSec() {
    const m = parseInt($("metro-pop-min").value, 10) || 0;
    const s = parseInt($("metro-pop-sec").value, 10) || 0;
    return m * 60 + s;
  }

  async function saveTimerEditor() {
    if (editingTimer === null) return;
    const duration = popDurationSec();
    if (duration < 1 || duration > MAX_TIMER_SEC) {
      setStatus(t("metroDurationErr"), "error");
      return;
    }
    const fields = {
      label: $("metro-pop-name").value.trim(),
      duration_sec: duration,
      sound_key: $("metro-pop-sound").value,
    };

    if (editingTimer === NEW_TIMER) {
      const res = await fetch("/api/metronomes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...fields, enabled: true }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setStatus(data.detail || t("saveFailed"), "error");
        return;
      }
      const row = await res.json();
      timers.push({ ...row, endsAt: Date.now() + row.duration_sec * 1000, pausedRemain: 0, flashUntil: 0 });
      renderPills();
      setStatus(t("timerSaved"));
      closeTimerEditor();
      return;
    }

    const timer = timers.find((x) => x.id === editingTimer);
    if (!timer) { closeTimerEditor(); return; }
    patchTimer(timer, fields, () => {
      const changedDuration = timer.duration_sec !== fields.duration_sec;
      Object.assign(timer, fields);
      if (changedDuration) {
        const total = timer.duration_sec * 1000;
        timer.flashUntil = 0;
        if (timer.enabled) {
          timer.endsAt = Date.now() + total;
          timer.pausedRemain = 0;
        } else {
          timer.pausedRemain = total;
        }
      }
      renderPills();
      setStatus(t("timerSaved"));
      closeTimerEditor();
    });
  }

  function setupTimerRail() {
    $("metro-add-btn").addEventListener("click", () => openTimerEditor(NEW_TIMER));
    $("metro-pop-cancel").addEventListener("click", closeTimerEditor);
    $("metro-pop-save").addEventListener("click", saveTimerEditor);
    $("metro-pop-preview").addEventListener("click", () => {
      unlockAudio();
      playChime($("metro-pop-sound").value);
    });
    $("metro-pop-sound").addEventListener("change", () => {
      unlockAudio();
      playChime($("metro-pop-sound").value);
    });
    ["metro-pop-min", "metro-pop-sec"].forEach((id) => {
      $(id).addEventListener("keydown", (e) => {
        if (e.key === "Enter") { e.preventDefault(); saveTimerEditor(); }
      });
    });
    ["pointerdown", "keydown"].forEach((ev) =>
      window.addEventListener(ev, unlockAudio, { capture: true }));
    document.addEventListener("visibilitychange", () => {
      if (!document.hidden) refreshPills();
    });
    setInterval(metroTick, 200);
  }

  // ---------- History export ----------
  function setExportStatus(msg, isError) {
    const el = $("export-status");
    el.textContent = msg;
    el.classList.toggle("error", !!isError);
  }

  function exportRange(days) {
    const today = bjParts();
    if (days === "all") return { start: "", end: "" };
    if (days === "month") return { start: toISO({ ...today, day: 1 }), end: toISO(today) };
    const n = Math.max(1, parseInt(days, 10) || 30);
    return { start: toISO(dateWithOffset(today, -(n - 1))), end: toISO(today) };
  }

  function applyExportRange(days) {
    const { start, end } = exportRange(days);
    $("export-start").value = start;
    $("export-end").value = end;
    document.querySelectorAll("#export-quick button").forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.days === days);
    });
    setExportStatus("");
  }

  function exportFormat() {
    const checked = document.querySelector('input[name="export-format"]:checked');
    return checked ? checked.value : "json";
  }

  function downloadText(filename, mime, text) {
    const url = URL.createObjectURL(new Blob([text], { type: mime }));
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.append(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  function openExportModal() {
    applyExportRange("30");
    $("export-modal").showModal();
  }

  async function runExport() {
    if (!isLoggedIn) {
      setExportStatus(t("exportNeedLogin"), true);
      return;
    }
    const start = $("export-start").value.trim();
    const end = $("export-end").value.trim();
    if (start && end && start > end) {
      setExportStatus(t("exportReversed"), true);
      return;
    }
    const format = exportFormat();
    const params = new URLSearchParams({ format });
    if (start) params.set("start", start);
    if (end) params.set("end", end);

    setExportStatus(t("exportRunning"));
    let res;
    try {
      res = await fetch(`/api/export?${params}`);
    } catch {
      setExportStatus(t("exportFailed"), true);
      return;
    }
    if (res.status === 401) {
      setExportStatus(t("exportAuth"), true);
      return;
    }
    if (!res.ok) {
      const detail = await res.json().catch(() => null);
      setExportStatus(detail && detail.detail ? detail.detail : t("exportFailed"), true);
      return;
    }

    const name = `chronosfit_${start || "all"}_${end || "all"}.${format}`;
    let count = 0;
    if (format === "csv") {
      const text = await res.text();
      // The leading BOM belongs to the first cell, so counting rows is safest here.
      count = Math.max(0, text.split(/\r?\n/).filter((line) => line.trim()).length - 1);
      downloadText(name, "text/csv;charset=utf-8", text);
    } else {
      const data = await res.json();
      count = Object.values(data)
        .filter(Array.isArray)
        .reduce((total, group) => total + group.length, 0);
      downloadText(name, "application/json;charset=utf-8", JSON.stringify(data, null, 2));
    }
    setExportStatus(t(count ? "exportCount" : "exportNone", { n: count }));
  }

  function setupExportDialog() {
    $("export-close").addEventListener("click", () => $("export-modal").close());
    $("export-modal").addEventListener("click", (e) => {
      if (e.target === e.currentTarget) e.currentTarget.close();
    });
    $("export-quick").addEventListener("click", (e) => {
      const btn = e.target.closest("button");
      if (btn) applyExportRange(btn.dataset.days);
    });
    ["export-start", "export-end"].forEach((id) => {
      $(id).addEventListener("input", () => {
        document.querySelectorAll("#export-quick button.active").forEach((b) => b.classList.remove("active"));
      });
    });
    $("export-run").addEventListener("click", runExport);
  }

  // ---------- Plan editor ----------
  let planEditOriginal = null;
  // "edit" = 正在改一份已存在的计划；"blank" = 正在新建空白计划。
  let planEditorMode = "edit";

  function planHasChanges() {
    if (!planEditOriginal) return false;
    const currentName = $("plan-name").value.trim();
    const currentWd = $("plan-weekday").value;
    return currentName !== planEditOriginal.name ||
      currentWd !== (planEditOriginal.weekday || "") ||
      JSON.stringify(currentPlanItems()) !== JSON.stringify(planEditOriginal.items);
  }

  function tryClosePlanModal() {
    if (planHasChanges()) {
      if (!confirm(t("confirmDiscard"))) return;
    }
    $("plan-modal").close();
  }

  function appendPlanRow(value) {
    const box = $("plan-edit-items");
    const row = document.createElement("div");
    row.className = "pedit-row";
    const inp = document.createElement("input");
    inp.type = "text";
    inp.value = value || "";
    inp.placeholder = t("planItemPh");
    const rm = document.createElement("button");
    rm.type = "button";
    rm.className = "row-rm";
    rm.textContent = "\u2715";
    rm.addEventListener("click", () => {
      row.remove();
      keepPlanTailRow();
    });
    inp.addEventListener("input", keepPlanTailRow);
    inp.addEventListener("keydown", (e) => {
      if (e.key !== "Enter") return;
      e.preventDefault();
      const tail = keepPlanTailRow();
      if (tail !== inp) tail.focus();
    });
    row.append(inp, rm);
    box.append(row);
    return inp;
  }

  function planRows() {
    return [...$("plan-edit-items").querySelectorAll("input")];
  }

  function keepPlanTailRow() {
    const rows = planRows();
    const last = rows[rows.length - 1];
    if (last && !last.value.trim()) return last;
    return appendPlanRow("");
  }

  function renderPlanRows(items) {
    const box = $("plan-edit-items");
    box.innerHTML = "";
    items.forEach((item) => appendPlanRow(item));
    keepPlanTailRow();
  }

  function currentPlanItems() {
    return planRows().map((i) => i.value.trim()).filter(Boolean);
  }

  function clearPlanItems() {
    if (!planRows().some((i) => i.value.trim())) { keepPlanTailRow(); return; }
    if (!confirm(t("confirmClearItems"))) return;
    renderPlanRows([]);
    showToast(t("itemsCleared"));
  }

  function restorePlanItems() {
    const name = $("plan-name").value.trim();
    const items = defaultPlans[name];
    if (!items || !items.length) { showToast(t("noDefaultItems")); return; }
    if (JSON.stringify(items) === JSON.stringify(currentPlanItems())) return;
    if (!confirm(t("confirmRestoreItems"))) return;
    renderPlanRows(items);
    showToast(t("itemsRestored"));
  }

  function populateModalPlanSelect(selected) {
    const sel = $("plan-modal-select");
    sel.innerHTML = "";
    // 空占位项：新建空白模式下 value="" 才能真的显示为空，而不是误显示第一个计划。
    const blank = document.createElement("option");
    blank.value = "";
    blank.textContent = t("pickPlanPlaceholder");
    sel.append(blank);
    Object.keys(plans).forEach((name) => {
      const opt = document.createElement("option");
      opt.value = name;
      opt.textContent = name;
      sel.append(opt);
    });
    if (selected && plans[selected]) sel.value = selected;
  }

  function populateWeekdaySelect(selected) {
    const sel = $("plan-weekday");
    sel.innerHTML = "";
    const none = document.createElement("option");
    none.value = "";
    none.textContent = t("none");
    sel.append(none);
    WEEKDAY_ORDER.forEach((en) => {
      const opt = document.createElement("option");
      opt.value = en;
      opt.textContent = displayWeekday(en);
      sel.append(opt);
    });
    sel.value = selected && WEEKDAY_ORDER.includes(selected) ? selected : "";
  }

  function loadPlanIntoEditor(name) {
    const items = plans[name] || [];
    $("plan-name").value = name;
    renderPlanRows(items);
    populateWeekdaySelect(planWeekdayOf(name));
    planEditOriginal = { name, items: items.slice(), weekday: planWeekdayOf(name) };
  }

  /* 编辑器有两种互斥的工作模式，用「新建空白」提示条和按钮可用状态明确区分：
     - edit：正在编辑一份已存在的计划 →「保存」原地覆盖，「删除」可用
     - blank：正在新建空白计划 →「保存」创建新计划，「删除」禁用
     「另存为新计划」在两种模式下都可用，语义固定为「原计划不动，存成一份新的」。 */
  function setEditorMode(mode) {
    planEditorMode = mode;
    const blank = mode === "blank";
    $("plan-new-hint").hidden = !blank;
    $("plan-delete").disabled = blank;
  }

  function startBlankPlan() {
    loadPlanIntoEditor("");
    $("plan-modal-select").value = "";
    setEditorMode("blank");
    keepPlanTailRow().focus();
  }

  function openPlanModal() {
    if (!isLoggedIn) {
      setStatus(t("needLoginEdit"), "error");
      openAuthModal("signin");
      return;
    }
    populateModalPlanSelect(currentPlan);
    loadPlanIntoEditor(currentPlan);
    setEditorMode("edit");
    $("plan-modal").showModal();
    setTimeout(() => keepPlanTailRow().focus(), 50);
  }

  // 给「另存为」挑一个不与现有计划重名的名字：原名 + 副本 / 副本 2 / 副本 3 …
  function uniqueCopyName(base) {
    const suffix = t("saveAsSuffix");
    const root = (base || "").trim() || t("untitledPlan");
    let name = root + suffix;
    let n = 2;
    while (plans[name]) {
      name = root + suffix + " " + n;
      n += 1;
    }
    return name;
  }

  async function postPlan(name, items, weekday) {
    await fetch("/api/plans", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, items, weekday }),
    });
    await reloadPlans();
    currentPlan = name;
    $("plan-select").value = name;
    reloadAll();
  }

  async function reloadPlans() {
    const data = await (await fetch("/api/plans")).json();
    applyPlansPayload(data);
  }

  function applyPlansPayload(data) {
    plans = data.plans;
    weekdayPlan = data.weekday_plan || {};
    defaultPlans = data.default_plans || {};
    // Runs before and after every plan reload: keep the current pick while it still
    // exists, otherwise fall back to today's plan so the selector is never left blank.
    currentPlan = usablePlan(currentPlan) || defaultPlanForToday(bjParts());
    populateSelect();
  }

  function reloadAll() {
    renderPlan();
    loadLogs();
    loadMeals();
    loadCalendarDates();
  }

  /* 「保存」= 写回当前编辑的目标：
     - blank 模式：新建一份计划
     - edit 模式：原地覆盖同名计划；若用户改了名称，后端按名称为主键、不会删除旧计划，
       所以先明确告知「这会新建一份、原计划保留」，避免用户以为是在重命名。 */
  async function savePlan() {
    const name = $("plan-name").value.trim();
    if (!name) { $("plan-name").focus(); return; }
    const original = planEditOriginal && planEditOriginal.name;
    if (planEditorMode === "edit" && original && name !== original && plans[original]) {
      if (!confirm(t("confirmRenameAsNew", { x: original }))) return;
    }
    const isNew = !plans[name];
    await postPlan(name, currentPlanItems(), $("plan-weekday").value || null);
    setEditorMode("edit");
    $("plan-modal").close();
    setStatus(t(isNew ? "planCreated" : "planSaved", { x: name }));
  }

  /* 「另存为新计划」= 原计划完全不动，把当前编辑内容存成一份新计划并切换过去。 */
  async function savePlanAs() {
    let name = $("plan-name").value.trim();
    if (!name || plans[name]) name = uniqueCopyName(name);
    $("plan-name").value = name;
    let weekday = $("plan-weekday").value || null;
    /* 星期绑定是「一个星期 → 一份计划」的一对一关系：另存为时若沿用原计划的星期，
       绑定会从原计划手里抢走。默认不抢，在结果提示里说明原因。 */
    let unbound = "";
    if (weekday && weekdayPlan[weekday] && weekdayPlan[weekday] !== name) {
      unbound = " · " + t("weekdayTaken", { x: weekdayPlan[weekday] });
      weekday = null;
    }
    await postPlan(name, currentPlanItems(), weekday);
    // 已经落盘，编辑器现在就是在编辑这份新计划。
    setEditorMode("edit");
    $("plan-modal").close();
    setStatus(t("planSavedAs", { x: name }) + unbound, unbound ? "error" : "");
  }

  async function deletePlan() {
    const name = $("plan-name").value.trim();
    if (!name || planEditorMode === "blank") return;
    if (!confirm(t("confirmDelete", { x: name }))) return;
    await fetch(`/api/plans?name=${encodeURIComponent(name)}`, { method: "DELETE" });
    await reloadPlans();
    $("plan-select").value = currentPlan;
    reloadAll();
    $("plan-modal").close();
    setStatus(t("planDeleted", { x: name }));
  }

  // ---------- 两页导航：滚轮整屏翻页 + 点选 / 键盘兜底 ----------
  const PAGES = ["plan", "history"];
  const WIDE = window.matchMedia("(min-width: 1321px)");
  let currentPageIndex = 0;
  let wheelLock = 0;

  function activePageEl() {
    return document.querySelector(".page.active");
  }

  function switchPage(target, { updateChart = true } = {}) {
    const idx = typeof target === "number"
      ? Math.max(0, Math.min(PAGES.length - 1, target))
      : Math.max(0, PAGES.indexOf(target));
    if (idx < 0 || idx === currentPageIndex) return;
    currentPageIndex = idx;
    const pageName = PAGES[idx];

    // 宽屏靠轨道 translateX 滑动；active 类仍维护，供窄屏显隐与样式使用。
    const track = $("pages");
    if (track) track.dataset.index = String(idx);

    document.querySelectorAll(".page").forEach((p) => {
      const active = p.dataset.page === pageName;
      p.classList.toggle("active", active);
      /* 宽屏下两页都在轨道里，非当前页虽移出可视区仍可被 Tab 聚焦。
         用 inert 屏蔽它，既不影响滑动动画，也不让键盘跑进看不见的页面。 */
      if (active) p.removeAttribute("inert");
      else p.setAttribute("inert", "");
    });

    document.querySelectorAll(".nav-dot").forEach((dot) => {
      const active = dot.dataset.page === pageName;
      dot.classList.toggle("active", active);
      dot.setAttribute("aria-selected", active ? "true" : "false");
    });

    const prevBtn = $("nav-prev");
    const nextBtn = $("nav-next");
    if (prevBtn) prevBtn.disabled = idx === 0;
    if (nextBtn) nextBtn.disabled = idx === PAGES.length - 1;

    // 新页从顶部开始：宽屏每页是独立滚动容器，窄屏回到文档滚动。
    const page = activePageEl();
    if (page) page.scrollTop = 0;
    if (!WIDE.matches) window.scrollTo({ top: 0, behavior: "smooth" });

    // display:none → block 会让图表缓存宽度失效，切到第 2 页时重绘。
    if (updateChart && pageName === "history") {
      lastChartW = 0;
      redrawBodyChart();
    }
  }

  /* 页内还有滚动余地时交给浏览器原生滚动；已经推到边界还继续滚，才整页切换。
     这样既满足「滚轮直接跳页」，又不会让超长内容看不全。 */
  function canScrollPage(el, dir) {
    if (!el) return false;
    if (el.scrollHeight - el.clientHeight <= 1) return false;
    return dir > 0
      ? el.scrollTop + el.clientHeight < el.scrollHeight - 1
      : el.scrollTop > 0;
  }

  function handleWheel(e) {
    // 只有整屏模式才接管滚轮；窄屏保持普通文档滚动。
    if (!WIDE.matches) return;
    // 弹层打开时完全不接管滚轮，避免和对话框内部滚动打架。
    const dlg = document.querySelector("dialog[open]");
    if (dlg && e.target instanceof Node && dlg.contains(e.target)) return;
    if (e.target instanceof Element && e.target.closest(".more-menu, .auth-menu")) return;

    const dir = Math.sign(e.deltaY);
    if (!dir) return;

    const page = activePageEl();
    if (canScrollPage(page, dir)) return;

    const next = currentPageIndex + dir;
    if (next < 0 || next >= PAGES.length) return;

    e.preventDefault();
    const now = Date.now();
    if (now - wheelLock < 450) return;   // 一次手势只翻一页
    wheelLock = now;
    switchPage(next);
  }

  function setupPageNav() {
    const prevBtn = $("nav-prev");
    const nextBtn = $("nav-next");
    if (prevBtn) {
      prevBtn.addEventListener("click", () => switchPage(currentPageIndex - 1));
    }
    if (nextBtn) {
      nextBtn.addEventListener("click", () => switchPage(currentPageIndex + 1));
    }
    document.querySelectorAll(".nav-dot").forEach((dot) => {
      dot.addEventListener("click", () => switchPage(dot.dataset.page));
    });

    document.addEventListener("wheel", handleWheel, { passive: false });

    // 键盘：↑/↓ 直接翻页，Alt+←/→ 同样可用。
    document.addEventListener("keydown", (e) => {
      const tag = document.activeElement && document.activeElement.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
      const map = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 };
      if (e.key in map && (e.altKey || e.metaKey)) {
        e.preventDefault();
        switchPage(currentPageIndex + map[e.key]);
        return;
      }
      if (e.key === "ArrowDown" || e.key === "PageDown") { e.preventDefault(); switchPage(currentPageIndex + 1); }
      if (e.key === "ArrowUp" || e.key === "PageUp") { e.preventDefault(); switchPage(currentPageIndex - 1); }
    });
  }

  // ---------- Draggable side rails ----------
  /* 日历（左）与倒计时（右）两个侧栏可拖动：
     - 拖住面板头部（标题旁的 ⠿ 区域）自由移动，松手后固定在落点并保存；
     - 落到对侧面板上则交换左右位置；
     两种偏好都存 localStorage。 */
  function setupRailDrag() {
    const narrowMQ = window.matchMedia("(max-width: 1320px)");
    const calRail = $("calendar-rail");
    const metroRail = $("metro-rail");

    if (localStorage.getItem("chronosfit_rails") === "swapped") {
      document.body.classList.add("rails-swapped");
    }
    // 恢复上次自由摆放的位置（行内样式优先于 CSS 位置，与交换状态不冲突）。
    try {
      const pos = JSON.parse(localStorage.getItem("chronosfit_rail_pos") || "{}");
      for (const id of [calRail.id, metroRail.id]) {
        const p = pos[id];
        const rail = $(id);
        if (rail && p && Number.isFinite(p.left) && Number.isFinite(p.top)) {
          const x = Math.max(8, Math.min(p.left, window.innerWidth - rail.offsetWidth - 8));
          const y = Math.max(8, Math.min(p.top, window.innerHeight - rail.offsetHeight - 8));
          rail.style.transform = "none";
          rail.style.left = x + "px";
          rail.style.top = y + "px";
        }
      }
    } catch {}

    function clearInline(r) {
      r.style.left = "";
      r.style.top = "";
      r.style.transform = "";
    }

    function swapRails() {
      const swapped = document.body.classList.toggle("rails-swapped");
      localStorage.setItem("chronosfit_rails", swapped ? "swapped" : "normal");
      localStorage.removeItem("chronosfit_rail_pos"); // 交换后回到标准布局，清掉自由位置
      clearInline(calRail);
      clearInline(metroRail);
      document.body.classList.add("rails-swap-anim");
      setTimeout(() => document.body.classList.remove("rails-swap-anim"), 320);
    }

    function savePositions() {
      let pos = {};
      try {
        pos = JSON.parse(localStorage.getItem("chronosfit_rail_pos") || "{}");
      } catch {}
      [calRail, metroRail].forEach((r) => {
        if (r.style.left || r.style.top) {
          const rect = r.getBoundingClientRect();
          pos[r.id] = { left: Math.round(rect.left), top: Math.round(rect.top) };
        } else {
          delete pos[r.id];
        }
      });
      localStorage.setItem("chronosfit_rail_pos", JSON.stringify(pos));
    }

    [calRail, metroRail].forEach((rail) => {
      const head = rail.querySelector(".rail-head");
      const other = rail === calRail ? metroRail : calRail;
      let dragging = false;
      let moved = false;
      let dx = 0;
      let dy = 0;
      let startX = 0;
      let startY = 0;

      function dropHit(e) {
        const r = other.getBoundingClientRect();
        return (
          e.clientX >= r.left - 24 &&
          e.clientX <= r.right + 24 &&
          e.clientY >= r.top - 24 &&
          e.clientY <= r.bottom + 24
        );
      }

      function onDown(e) {
        // 窄屏是静态堆叠布局，拖动没有意义；点击按钮也不触发拖动。
        if (narrowMQ.matches) return;
        if (e.pointerType === "mouse" && e.button !== 0) return;
        if (e.target.closest("button, input, select, a")) return;
        e.preventDefault();
        const rect = rail.getBoundingClientRect();
        dragging = true;
        moved = false;
        dx = e.clientX - rect.left;
        dy = e.clientY - rect.top;
        startX = e.clientX;
        startY = e.clientY;
        rail.classList.add("rail-dragged");
        rail.style.left = rect.left + "px";
        rail.style.top = rect.top + "px";
        document.body.classList.add("rail-dragging");
        document.body.style.userSelect = "none";
        head.setPointerCapture(e.pointerId);
      }

      function onMove(e) {
        if (!dragging) return;
        if (!moved && Math.hypot(e.clientX - startX, e.clientY - startY) > 8) {
          moved = true;
        }
        if (!moved) return;
        const x = Math.max(8, Math.min(e.clientX - dx, window.innerWidth - rail.offsetWidth - 8));
        const y = Math.max(8, Math.min(e.clientY - dy, window.innerHeight - rail.offsetHeight - 8));
        rail.style.left = x + "px";
        rail.style.top = y + "px";
        other.classList.toggle("rail-drop-target", dropHit(e));
      }

      function onUp(e) {
        if (!dragging) return;
        const hit = moved && dropHit(e);
        other.classList.remove("rail-drop-target");
        if (hit) {
          reset();
          swapRails();
        } else if (moved) {
          // 未落到对侧：固定在移动后的位置，并记住它（刷新不丢）。
          dragging = false;
          moved = false;
          rail.classList.remove("rail-dragged");
          rail.style.transform = "none";
          document.body.classList.remove("rail-dragging");
          document.body.style.userSelect = "";
          savePositions();
        } else {
          reset();
        }
      }

      function reset() {
        dragging = false;
        moved = false;
        rail.classList.remove("rail-dragged");
        clearInline(rail);
        document.body.classList.remove("rail-dragging");
        document.body.style.userSelect = "";
      }

      head.addEventListener("pointerdown", onDown);
      head.addEventListener("pointermove", onMove);
      head.addEventListener("pointerup", onUp);
      head.addEventListener("pointercancel", reset);
    });
  }

  // ---------- Init ----------
  /* 顺序刻意是「先绑定、后取数」：事件绑定不依赖任何服务端数据。
     以前是反的，只要 /api/plans 请求失败（服务刚重启、网络抖动都会），
     init 就在 await 处抛错中断，排在后面的 setupPageNav() 永远不执行 ——
     表现成「翻页箭头点了没反应、第二页一片空白」这种半死状态。 */
  async function init() {
    bindStaticUI();
    try {
      await loadInitialData();
    } catch (err) {
      console.error("[chronosfit] initial load failed", err);
      showInitFailure();
    }
    revealPage();
  }

  async function loadInitialData() {
    await checkAuth();
    if (!(isLoggedIn && currentUser && currentUser.language)) {
      applyLang(localStorage.getItem("chronosfit_lang") || "zh");
    }

    const res = await fetch("/api/plans");
    const data = await res.json();
    currentDate = toISO(bjParts());
    applyPlansPayload(data);

    renderPlan();
    loaded = true;
    loadLogs();
    loadMeals();
    loadTicker();
    loadTimers();

    const todayForCal = bjParts();
    calYear = todayForCal.year;
    calMonth = todayForCal.month;
    loadCalendarDates();
    // 历史到手后再画一次：此时第 2 页可能仍不可见，切页时还会重绘兜底。
    redrawBodyChart();
  }

  function bindStaticUI() {
    setupBody();
    setupTimerRail();
    setupTickerAddForm();
    setupExportDialog();
    setupGoalDialog();
    setupScroll();
    setupAccountMenu();
    setupTopBarButtons();
    setupSettingsModal();
    setupAdminModal();
    setupPageNav();
    setupRailDrag();

    $("cal-prev").addEventListener("click", calPrev);
    $("cal-next").addEventListener("click", calNext);

    // Auth events
    $("auth-open-btn").addEventListener("click", () => openAuthModal("signin"));
    $("auth-logout-btn").addEventListener("click", doLogout);
    $("auth-modal-close").addEventListener("click", () => $("auth-modal").close());
    $("auth-modal").addEventListener("click", (e) => {
      if (e.target === e.currentTarget) e.currentTarget.close();
    });
    document.querySelectorAll("#auth-modal .auth-links a").forEach((a) => {
      a.addEventListener("click", (e) => {
        e.preventDefault();
        switchAuthView(a.dataset.goto);
      });
    });
    $("signin-btn").addEventListener("click", doSignIn);
    $("signup-btn").addEventListener("click", doSignUp);
    $("reset-btn").addEventListener("click", doReset);
    $("signup-send").addEventListener("click", () =>
      sendCode($("signup-email").value.trim(), "register", $("signup-send")));
    $("reset-send").addEventListener("click", () =>
      sendCode($("reset-email").value.trim(), "reset", $("reset-send")));
    $("signin-password").addEventListener("keydown", (e) => {
      if (e.key === "Enter") doSignIn();
    });

    // Top-bar / toolbar events
    $("fullscreen-btn").addEventListener("click", toggleFullscreen);
    $("today-btn").addEventListener("click", goToday);
    document.querySelectorAll(".back-today").forEach((btn) => {
      btn.addEventListener("click", goToday);
    });

    $("plan-edit-btn").addEventListener("click", openPlanModal);
    // 新建与「编辑当前计划」是两件事：先确认放弃未保存改动，再切到空白模式。
    $("plan-new-btn").addEventListener("click", () => {
      if (planHasChanges() && !confirm(t("confirmDiscard"))) return;
      startBlankPlan();
    });
    $("plan-modal-select").addEventListener("change", (e) => {
      const name = e.target.value;
      if (planHasChanges() && !confirm(t("confirmSwitch"))) {
        e.target.value = planEditOriginal ? planEditOriginal.name : name;
        return;
      }
      loadPlanIntoEditor(name);
      setEditorMode("edit");
    });
    $("plan-items-clear").addEventListener("click", clearPlanItems);
    $("plan-items-restore").addEventListener("click", restorePlanItems);
    $("ticker-clear-btn").addEventListener("click", () => resetTicker("clear"));
    $("ticker-restore-btn").addEventListener("click", () => resetTicker("defaults"));
    $("plan-save").addEventListener("click", savePlan);
    $("plan-save-as").addEventListener("click", savePlanAs);
    $("plan-cancel").addEventListener("click", tryClosePlanModal);
    $("plan-delete").addEventListener("click", deletePlan);
    $("plan-close").addEventListener("click", tryClosePlanModal);
    $("plan-name").addEventListener("keydown", (e) => {
      if (e.key === "Enter") e.preventDefault();
    });
    $("plan-modal").addEventListener("click", (e) => {
      if (e.target === e.currentTarget) tryClosePlanModal();
    });

    $("plan-select").addEventListener("change", (e) => {
      currentPlan = e.target.value;
      renderPlan();
      loadLogs();
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && document.fullscreenElement) {
        document.exitFullscreen?.();
      }
    });

    const hint = $("fullscreen-hint");
    document.addEventListener("fullscreenchange", () => {
      $("fullscreen-btn").textContent = document.fullscreenElement ? "✕" : "⛶";
      $("fullscreen-btn").setAttribute("title", t(document.fullscreenElement ? "fullscreenTipExit" : "fullscreenTip"));
      hint.classList.toggle("show", !!document.fullscreenElement);
    });
  }

  /* 首屏取数失败时给出可见反馈，而不是留一个静默半死的页面。 */
  function showInitFailure() {
    const list = $("items");
    if (!list || list.querySelector(".init-failure")) return;
    list.innerHTML = "";
    const li = document.createElement("li");
    li.className = "init-failure";

    const p = document.createElement("p");
    p.textContent = t("initFailure");

    const retry = document.createElement("button");
    retry.type = "button";
    retry.className = "init-failure-btn";
    retry.textContent = t("retry");
    retry.addEventListener("click", () => {
      retry.disabled = true;
      // loadInitialData 成功时自己会 renderPlan，这里只需处理失败回滚。
      loadInitialData().catch(() => { retry.disabled = false; });
    });

    li.append(p, retry);
    list.append(li);
  }

  init();
})();
