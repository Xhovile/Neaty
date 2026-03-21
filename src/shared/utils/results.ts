import { AssessmentComponent, GradeScale } from '../../domain/assessments/types';

export const calculateWeightedTotal = (scores: { [componentId: string]: number }, components: AssessmentComponent[]): number => {
  let total = 0;
  components.forEach(comp => {
    const score = scores[comp.id] || 0;
    // Calculate weighted contribution: (score / maxScore) * weight
    total += (score / comp.maxScore) * comp.weight;
  });
  return Math.round(total * 100) / 100;
};

export const getGradeFromScale = (total: number, scale: GradeScale[]): { grade: string; remark: string } => {
  const found = scale.find(s => total >= s.minScore && total <= s.maxScore);
  return found ? { grade: found.grade, remark: found.remark } : { grade: 'N/A', remark: 'No Grade' };
};
