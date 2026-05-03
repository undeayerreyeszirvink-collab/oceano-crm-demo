// 行业基线配置
const INDUSTRY_BASELINES = {
  "制造业": { value: 3.8, readiness: 2.8, risk: 3.2 },
  "批发和零售业": { value: 3.5, readiness: 3.2, risk: 2.8 },
  "租赁和商务服务业": { value: 3.2, readiness: 3.0, risk: 3.0 },
  "科学研究和技术服务业": { value: 4.2, readiness: 3.8, risk: 3.5 },
  "建筑业": { value: 3.0, readiness: 2.5, risk: 3.8 },
  "信息传输软件和信息技术服务业": { value: 4.5, readiness: 4.2, risk: 2.5 },
  "交通运输仓储和邮政业": { value: 3.6, readiness: 2.9, risk: 3.3 }
};

// 测试案例
const TEST_CASES = [
  {
    industry: "制造业",
    scenario: "AI视觉质检系统",
    company: "精密零部件制造企业",
    scores: { value: 3.75, readiness: 3.00, risk: 3.30 },
    gate: { passed: true, decision: "推进" }
  },
  {
    industry: "批发和零售业",
    scenario: "智能客服系统",
    company: "连锁超市集团",
    scores: { value: 3.80, readiness: 3.50, risk: 2.60 },
    gate: { passed: true, decision: "推进" }
  },
  {
    industry: "租赁和商务服务业",
    scenario: "智能合同审核",
    company: "商业地产租赁公司",
    scores: { value: 3.40, readiness: 3.20, risk: 2.90 },
    gate: { passed: true, decision: "试点" }
  },
  {
    industry: "科学研究和技术服务业",
    scenario: "AI辅助研发平台",
    company: "生物医药研发机构",
    scores: { value: 4.50, readiness: 4.00, risk: 3.40 },
    gate: { passed: true, decision: "推进" }
  },
  {
    industry: "建筑业",
    scenario: "施工安全监控",
    company: "大型建筑施工企业",
    scores: { value: 3.20, readiness: 2.60, risk: 3.70 },
    gate: { passed: false, decision: "暂缓" }
  },
  {
    industry: "信息传输软件和信息技术服务业",
    scenario: "代码自动审查",
    company: "软件开发公司",
    scores: { value: 4.60, readiness: 4.30, risk: 2.40 },
    gate: { passed: true, decision: "推进" }
  },
  {
    industry: "交通运输仓储和邮政业",
    scenario: "智能路径优化",
    company: "物流配送企业",
    scores: { value: 3.70, readiness: 3.10, risk: 3.20 },
    gate: { passed: true, decision: "推进" }
  }
];

// 测试函数
function runTest(testCase) {
  const baseline = INDUSTRY_BASELINES[testCase.industry];
  const { value, readiness, risk } = testCase.scores;

  const valueDiff = value - baseline.value;
  const readinessDiff = readiness - baseline.readiness;
  const riskDiff = risk - baseline.risk;

  const baseScore = (value * 0.4 + readiness * 0.3 + (5 - risk) * 0.3).toFixed(2);
  const finalScore = (parseFloat(baseScore) + 0.65).toFixed(2);

  return {
    ...testCase,
    baseline,
    diffs: { value: valueDiff.toFixed(2), readiness: readinessDiff.toFixed(2), risk: riskDiff.toFixed(2) },
    baseScore,
    finalScore,
    rating: finalScore >= 4.0 ? "强烈建议实施" : finalScore >= 3.5 ? "建议实施" : finalScore >= 3.0 ? "谨慎评估" : "不建议实施"
  };
}

// 执行所有测试
const results = TEST_CASES.map(runTest);

// 导出
if (typeof module !== 'undefined') module.exports = { INDUSTRY_BASELINES, TEST_CASES, results };
