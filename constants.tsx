
import { ConstitutionType, ConstitutionDetail, Question } from './types';

export const CONSTITUTIONS: Record<ConstitutionType, ConstitutionDetail> = {
  [ConstitutionType.PEACEFUL]: {
    type: ConstitutionType.PEACEFUL,
    description: "阴阳气血调和，体态适中，面色红润，精力充沛。",
    features: ["肤色润泽", "目光有神", "鼻色明润", "嗅觉通利"],
    exercise: "舒缓且规律的运动，如慢跑、散步、太极拳等。",
    diet: "饮食有节，不偏嗜。多食五谷杂粮、蔬菜水果。",
    emotion: "性格开朗，社会适应能力强。"
  },
  [ConstitutionType.QI_DEFICIENCY]: {
    type: ConstitutionType.QI_DEFICIENCY,
    description: "肌肉松软，语声低微，容易疲乏，常出虚汗。",
    features: ["面色偏黄", "目光少神", "口淡无味", "脉象虚弱"],
    exercise: "避免剧烈运动，适合柔和的传统功法如八段锦、散步。",
    diet: "宜食益气健脾的食物，如山药、大枣、牛肉、鸡肉。",
    emotion: "不宜过度思虑，保持心境平和。"
  },
  [ConstitutionType.YANG_DEFICIENCY]: {
    type: ConstitutionType.YANG_DEFICIENCY,
    description: "耐夏不耐冬，手足不温，喜热饮食。",
    features: ["面色白皙", "口唇色淡", "毛发易落", "易畏寒"],
    exercise: "适合日光浴，运动以舒缓为主，如慢走。",
    diet: "宜食温补之品，如生姜、羊肉、肉桂。忌食生冷。",
    emotion: "性格沉静，应多参加集体活动，振奋精神。"
  },
  [ConstitutionType.YIN_DEFICIENCY]: {
    type: ConstitutionType.YIN_DEFICIENCY,
    description: "体形瘦长，手足心热，口燥咽干，性情急躁。",
    features: ["两颧微红", "眼干目涩", "皮肤干燥", "大便干结"],
    exercise: "运动量不宜过大，适合太极、游泳等可静心的活动。",
    diet: "宜食甘凉滋润之品，如百合、银耳、鸭肉。少食辛辣。",
    emotion: "注意戒躁，控制情绪，保持安静。"
  },
  [ConstitutionType.PHLEGM_DAMPNESS]: {
    type: ConstitutionType.PHLEGM_DAMPNESS,
    description: "体形肥胖，腹部松软，面部油腻，口中粘腻。",
    features: ["眼睑浮肿", "痰多", "肢体沉重", "舌苔白腻"],
    exercise: "长期坚持中长距离步行、骑车、慢跑等。",
    diet: "宜食清淡，如赤小豆、冬瓜、荷叶。少食甜腻。 ",
    emotion: "应多与人交流，避免独处时产生懒散心理。"
  },
  [ConstitutionType.DAMP_HEAT]: {
    type: ConstitutionType.DAMP_HEAT,
    description: "面部油垢，易生痤疮，口苦口干，大便粘滞。",
    features: ["面部油亮", "眼圈发红", "皮肤瘙痒", "小便黄赤"],
    exercise: "适合大强度运动，如长跑、游泳、球类，以排汗排毒。",
    diet: "宜食清热利湿之品，如薏苡仁、绿豆、芹菜、苦瓜。",
    emotion: "适合练习瑜伽、静坐，调和心气，平抑焦虑。"
  },
  [ConstitutionType.BLOOD_STASIS]: {
    type: ConstitutionType.BLOOD_STASIS,
    description: "肤色晦暗，常有瘀斑，口唇黯淡，舌质紫黯。",
    features: ["面部色斑", "眼眶发黑", "皮肤干燥", "头发易脱"],
    exercise: "持之以恒的体育锻炼，如步行、瑜伽，促进气血运行。",
    diet: "宜食行气活血之品，如黑木耳、山楂、玫瑰花。",
    emotion: "容易抑郁，应多参加兴趣小组，保持乐观。"
  },
  [ConstitutionType.QI_STAGNATION]: {
    type: ConstitutionType.QI_STAGNATION,
    description: "体形瘦者为多，神情抑郁，胸闷不舒。",
    features: ["神情抑郁", "目光呆滞", "容易太息(叹气)", "入睡困难"],
    exercise: "参加集体娱乐活动，扩胸类运动如羽毛球、广播体操。",
    diet: "宜食理气解郁之品，如柑橘、陈皮、薄荷、佛手。",
    emotion: "应广交朋友，宣泄心中不快。"
  },
  [ConstitutionType.SPECIAL]: {
    type: ConstitutionType.SPECIAL,
    description: "对花粉、油漆、药物等易过敏，或有遗传性疾病。",
    features: ["鼻塞流涕", "皮肤划痕", "易发哮喘", "体质特异"],
    exercise: "根据自身耐受情况适度运动，避免花粉季节户外运动。",
    diet: "饮食清淡，避开过敏原。多食维生素丰富的蔬菜。",
    emotion: "增强信心，保持生活规律。"
  }
};

// Simplified set of representative questions for each type (Standard has 60+, we use 3 key ones per type for UI brevity)
export const QUESTIONS: Question[] = [
  { id: 1, text: "您容易感到疲乏吗？", category: ConstitutionType.QI_DEFICIENCY },
  { id: 2, text: "您比一般人容易出汗吗？", category: ConstitutionType.QI_DEFICIENCY },
  { id: 3, text: "您容易感冒吗？", category: ConstitutionType.QI_DEFICIENCY },
  
  { id: 4, text: "您感到手脚发凉吗？", category: ConstitutionType.YANG_DEFICIENCY },
  { id: 5, text: "您感到胃部怕冷，喜欢喝热饮吗？", category: ConstitutionType.YANG_DEFICIENCY },
  { id: 6, text: "受凉后容易腹泻吗？", category: ConstitutionType.YANG_DEFICIENCY },

  { id: 7, text: "您感到口干咽燥吗？", category: ConstitutionType.YIN_DEFICIENCY },
  { id: 8, text: "您感到手心足心发热吗？", category: ConstitutionType.YIN_DEFICIENCY },
  { id: 9, text: "您感到大便干燥、硬结吗？", category: ConstitutionType.YIN_DEFICIENCY },

  { id: 10, text: "您感到面部油腻、油脂较多吗？", category: ConstitutionType.PHLEGM_DAMPNESS },
  { id: 11, text: "您感到身体沉重、不轻松吗？", category: ConstitutionType.PHLEGM_DAMPNESS },
  { id: 12, text: "您的腹部肥满松软吗？", category: ConstitutionType.PHLEGM_DAMPNESS },

  { id: 13, text: "您面部容易长痘或生疮吗？", category: ConstitutionType.DAMP_HEAT },
  { id: 14, text: "您感到口苦或口臭吗？", category: ConstitutionType.DAMP_HEAT },
  { id: 15, text: "您感到小便色黄、灼热吗？", category: ConstitutionType.DAMP_HEAT },

  { id: 16, text: "您面部色泽晦暗或有褐色斑吗？", category: ConstitutionType.BLOOD_STASIS },
  { id: 17, text: "您感到眼眶暗黑（黑眼圈）吗？", category: ConstitutionType.BLOOD_STASIS },
  { id: 18, text: "您的嘴唇颜色发紫发暗吗？", category: ConstitutionType.BLOOD_STASIS },

  { id: 19, text: "您感到精神抑郁、闷闷不乐吗？", category: ConstitutionType.QI_STAGNATION },
  { id: 20, text: "您无缘无故地喜欢叹气吗？", category: ConstitutionType.QI_STAGNATION },
  { id: 21, text: "您常感到胸闷、胁肋部胀痛吗？", category: ConstitutionType.QI_STAGNATION },

  { id: 22, text: "您容易过敏（季节、食物、油漆等）吗？", category: ConstitutionType.SPECIAL },
  { id: 23, text: "您的皮肤受挤压后容易起红疹（划痕症）吗？", category: ConstitutionType.SPECIAL },
  { id: 24, text: "您经常无故打喷嚏、流鼻涕吗？", category: ConstitutionType.SPECIAL },

  { id: 25, text: "您的精力充沛、说话声音洪亮吗？", category: ConstitutionType.PEACEFUL },
  { id: 26, text: "您的睡眠情况良好吗？", category: ConstitutionType.PEACEFUL },
  { id: 27, text: "您对外界环境适应能力强吗？", category: ConstitutionType.PEACEFUL }
];
