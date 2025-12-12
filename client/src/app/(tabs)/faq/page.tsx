'use client';

import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { ChevronDown, ChevronUp, HelpCircle, Smartphone, Car, Calendar, DollarSign, Lock, User, Mail } from 'lucide-react-native';
import { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function FAQPage() {
  const [expandedCategory, setExpandedCategory] = useState<string | null>('principais');
  const [expandedQuestion, setExpandedQuestion] = useState<string | null>(null);

  const faqCategories = [
    {
      id: 'principais',
      title: 'Perguntas Principais',
      icon: HelpCircle,
      color: '#283B7D',
      questions: [
        {
          id: 'q1',
          question: 'O que é o SmartGate?',
          answer: 'SmartGate é um aplicativo de gestão condominial completo que permite transparência de condomínios para com os seus moradores, disponibilizando dados financeiros, de autorização de entrada e veículos, e avisos, tudo num ambiente só.'
        },
        {
          id: 'q2',
          question: 'Como faço para criar uma conta?',
          answer: 'Para criar sua conta, clique em "Cadastrar" na tela inicial, preencha seus dados (nome, email, telefone e senha) e confirme seu email através do link enviado. A confirmação é obrigatória por segurança.'
        },
        {
          id: 'q3',
          question: 'Preciso confirmar meu email?',
          answer: 'Sim! Por questões de segurança, você receberá um email com um link de confirmação válido por 15 minutos. Caso expire, você pode solicitar um novo link na tela de login.'
        },
        {
          id: 'q4',
          question: 'O aplicativo é seguro?',
          answer: 'Sim! Utilizamos autenticação JWT, criptografia de senhas, tokens de segurança e todas as melhores práticas de segurança para proteger seus dados.'
        }
      ]
    },
    {
      id: 'funcionalidades',
      title: 'Funcionalidades',
      icon: Smartphone,
      color: '#6b84a1',
      questions: [
        {
          id: 'f1',
          question: 'Quais são as principais funcionalidades?',
          answer: 'O SmartGate oferece: visualização de eventos do condomínio, consulta de gastos e despesas, cadastro e gerenciamento de veículos, perfil do usuário, notificações importantes e recuperação de senha.'
        },
        {
          id: 'f2',
          question: 'Posso usar no Android e iOS?',
          answer: 'Sim! O SmartGate foi desenvolvido com React Native + Expo, funcionando perfeitamente em Android e iOS com a mesma experiência.'
        },
        {
          id: 'f3',
          question: 'Os dados ficam salvos offline?',
          answer: 'Algumas informações ficam em cache para melhor performance, mas para garantir dados atualizados, recomendamos usar o app com conexão à internet.'
        },
        {
          id: 'f4',
          question: 'Como funciona a autenticação?',
          answer: 'Usamos tokens JWT que ficam válidos por 24 horas. Após esse período, você precisará fazer login novamente para garantir a segurança dos seus dados.'
        }
      ]
    },
    {
      id: 'veiculos',
      title: 'Veículos',
      icon: Car,
      color: '#283B7D',
      questions: [
        {
          id: 'v1',
          question: 'Como cadastrar um veículo?',
          answer: 'Acesse a aba "Veículos", clique em "Adicionar veículo", preencha os dados (tipo, nome, ano, placa, cor, responsável e apartamento) e clique em "Registrar Veículo".'
        },
        {
          id: 'v2',
          question: 'Posso cadastrar motos?',
          answer: 'Sim! O sistema suporta cadastro de carros e motos. Basta selecionar o tipo correto ao cadastrar.'
        },
        {
          id: 'v3',
          question: 'Como editar ou excluir um veículo?',
          answer: 'Na lista de veículos, toque no card do veículo desejado. Você verá opções para editar as informações ou excluir o cadastro.'
        },
        {
          id: 'v4',
          question: 'Qual formato de placa é aceito?',
          answer: 'O sistema aceita placas no formato antigo (ABC-1234) e no padrão Mercosul (ABC1D23). A validação é feita automaticamente.'
        },
        {
          id: 'v5',
          question: 'Posso cadastrar vários veículos?',
          answer: 'Sim! Você pode cadastrar quantos veículos precisar para seu apartamento, sejam carros ou motos.'
        }
      ]
    },
    {
      id: 'eventos',
      title: 'Eventos',
      icon: Calendar,
      color: '#6b84a1',
      questions: [
        {
          id: 'e1',
          question: 'Como visualizar os eventos do condomínio?',
          answer: 'Acesse a aba "Eventos" no menu principal. Lá você verá todos os eventos programados com data, horário, local e descrição.'
        },
        {
          id: 'e2',
          question: 'Posso criar eventos?',
          answer: 'Dependendo do seu nível de acesso, você pode criar eventos. Esta funcionalidade geralmente está disponível para síndicos e administradores.'
        },
        {
          id: 'e3',
          question: 'Recebo notificações de eventos?',
          answer: 'Sim! Você receberá notificações sobre eventos importantes do condomínio diretamente no aplicativo.'
        }
      ]
    },
    {
      id: 'gastos',
      title: 'Gastos e Despesas',
      icon: DollarSign,
      color: '#283B7D',
      questions: [
        {
          id: 'g1',
          question: 'Como consultar os gastos do condomínio?',
          answer: 'Acesse a aba "Gastos" para visualizar todas as despesas do condomínio, incluindo valores, datas e categorias.'
        },
        {
          id: 'g2',
          question: 'Posso ver o histórico de gastos?',
          answer: 'Sim! O sistema mantém um histórico completo de todas as despesas, permitindo análise e transparência financeira.'
        },
        {
          id: 'g3',
          question: 'Como funciona a categorização?',
          answer: 'Os gastos são categorizados automaticamente (manutenção, limpeza, segurança, etc.) para facilitar a visualização e controle.'
        }
      ]
    },
    {
      id: 'conta',
      title: 'Conta e Perfil',
      icon: User,
      color: '#6b84a1',
      questions: [
        {
          id: 'c1',
          question: 'Como visualizar meu perfil?',
          answer: 'Toque no ícone de perfil no menu principal. Lá você verá suas informações pessoais, dados do apartamento e opções de configuração.'
        },
        {
          id: 'c2',
          question: 'Posso editar minhas informações?',
          answer: 'Sim! Na tela de perfil você pode atualizar seu nome, telefone e outras informações pessoais.'
        },
        {
          id: 'c3',
          question: 'Como alterar minha senha?',
          answer: 'Acesse seu perfil e procure pela opção "Alterar Senha". Você precisará informar a senha atual e a nova senha.'
        },
        {
          id: 'c4',
          question: 'Como fazer logout?',
          answer: 'Na tela de perfil, role até o final e toque em "Sair" ou "Logout". Seus dados locais serão apagados por segurança.'
        }
      ]
    },
    {
      id: 'senha',
      title: 'Recuperação de Senha',
      icon: Lock,
      color: '#283B7D',
      questions: [
        {
          id: 's1',
          question: 'Esqueci minha senha, o que fazer?',
          answer: 'Na tela de login, clique em "Esqueci minha senha". Digite seu email cadastrado e você receberá instruções para criar uma nova senha.'
        },
        {
          id: 's2',
          question: 'Não recebi o email de recuperação',
          answer: 'Verifique sua caixa de spam. Se não encontrar, aguarde alguns minutos e tente solicitar novamente. O email é enviado via NodeMailer e pode levar alguns minutos.'
        },
        {
          id: 's3',
          question: 'O link de recuperação expirou',
          answer: 'Por segurança, os links de recuperação têm validade limitada. Solicite um novo link na tela de recuperação de senha.'
        },
        {
          id: 's4',
          question: 'Posso usar a mesma senha anterior?',
          answer: 'Por questões de segurança, recomendamos usar uma senha diferente da anterior. Use uma combinação forte de letras, números e caracteres especiais.'
        }
      ]
    },
    {
      id: 'suporte',
      title: 'Suporte e Contato',
      icon: Mail,
      color: '#6b84a1',
      questions: [
        {
          id: 'sup1',
          question: 'Como entrar em contato com o suporte?',
          answer: 'Você pode entrar em contato através do email suporte@smartgate.com ou falar com a administração do seu condomínio.'
        },
        {
          id: 'sup2',
          question: 'Encontrei um problema, o que fazer?',
          answer: 'Reporte o problema ao suporte com o máximo de detalhes possível: o que aconteceu, quando e em qual tela. Isso nos ajuda a resolver rapidamente.'
        },
        {
          id: 'sup3',
          question: 'Posso sugerir melhorias?',
          answer: 'Sim! Adoramos receber feedback dos usuários. Entre em contato com o suporte ou através da opção "Feedback" no app.'
        }
      ]
    }
  ];

  const toggleCategory = (categoryId: string) => {
    setExpandedCategory(expandedCategory === categoryId ? null : categoryId);
    setExpandedQuestion(null);
  };

  const toggleQuestion = (questionId: string) => {
    setExpandedQuestion(expandedQuestion === questionId ? null : questionId);
  };

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['left','right']}>
  
        {/* HEADER*/}
        <View className="px-4 py-4 bg-[#1E3070]">
            <Text className="text-3xl font-bold text-white mb-1">FAQ</Text>
            <Text className="text-blue-200">Perguntas Frequentes</Text>
        </View>

        {/* SCROLL*/}
        <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
            paddingBottom: 40,
            paddingTop: 10
            }}
            className="flex-1"
        >

          <View className="mx-6 mt-8">
            {faqCategories.map((category) => {
              const IconComponent = category.icon;
              const isExpanded = expandedCategory === category.id;
              
              return (
                <View key={category.id} className="mb-3">
                  {/* Category Header */}
                  <TouchableOpacity
                    onPress={() => toggleCategory(category.id)}
                    className="flex-row items-center justify-between p-4 mb-1 rounded-xl shadow-sm"
                    style={{ backgroundColor: category.color }}
                  >
                    <View className="flex-row items-center flex-1">
                      <IconComponent size={24} color="#fff" />
                      <Text className="ml-3 text-lg font-bold text-white flex-1">
                        {category.title}
                      </Text>
                    </View>
                    {isExpanded ? (
                      <ChevronUp size={24} color="#fff" />
                    ) : (
                      <ChevronDown size={24} color="#fff" />
                    )}
                  </TouchableOpacity>

                  {/* Questions */}
                  {isExpanded && (
                    <View className="mt-2 bg-gray-50 rounded-xl overflow-hidden">
                      {category.questions.map((q, index) => {
                        const isQuestionExpanded = expandedQuestion === q.id;
                        
                        return (
                          <View key={q.id}>
                            <TouchableOpacity
                              onPress={() => toggleQuestion(q.id)}
                              className="p-4 flex-row items-center justify-between"
                              style={{
                                backgroundColor: isQuestionExpanded ? '#F3F4F6' : 'transparent',
                                borderTopWidth: index > 0 ? 1 : 0,
                                borderTopColor: '#E5E7EB'
                              }}
                            >
                              <Text className="flex-1 font-medium text-gray-800 mr-2">
                                {q.question}
                              </Text>
                              {isQuestionExpanded ? (
                                <ChevronUp size={20} color="#6B7280" />
                              ) : (
                                <ChevronDown size={20} color="#6B7280" />
                              )}
                            </TouchableOpacity>
                            
                            {isQuestionExpanded && (
                              <View className="px-4 pb-4 pt-2 bg-white">
                                <Text className="text-gray-600 leading-6">
                                  {q.answer}
                                </Text>
                              </View>
                            )}
                          </View>
                        );
                      })}
                    </View>
                  )}
                </View>
              );
            })}

            {/* Footer Info */}
            <View className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
              <View className="flex-row items-start">
                <HelpCircle size={24} color="#283B7D" className="mt-1" />
                <View className="flex-1 ml-3">
                  <Text className="font-bold text-[#283B7D] mb-2">
                    Não encontrou sua resposta?
                  </Text>
                  <Text className="text-gray-600 leading-5 mb-3">
                    Entre em contato com o suporte através do email smartgateapp01@10347462.brevosend.com ou fale com a administração do seu condomínio.
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
    </SafeAreaView>
  );
}