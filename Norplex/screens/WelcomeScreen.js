import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Easing, Dimensions, Image } from 'react-native';

const { width, height } = Dimensions.get('window');

export default function WelcomeScreen({ navigation }) {
  const [fadeAnim] = useState(new Animated.Value(0));
  const [scaleAnim] = useState(new Animated.Value(0.8));
  const [slideAnims] = useState([
    new Animated.Value(100),
    new Animated.Value(100),
    new Animated.Value(100),
    new Animated.Value(100)
  ]);
  const [pulseAnim] = useState(new Animated.Value(0));
  const [particleAnims] = useState(Array(15).fill(0).map(() => new Animated.Value(0)));
  const [buttonScaleAnims] = useState([
    new Animated.Value(1),
    new Animated.Value(1),
    new Animated.Value(1),
    new Animated.Value(1)
  ]);

  useEffect(() => {
    // Background fade in animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();

    // Title scale animation
    Animated.timing(scaleAnim, {
      toValue: 1,
      duration: 600,
      easing: Easing.elastic(1),
      useNativeDriver: true,
    }).start();

    // Button slide animations with staggered timing
    const buttonAnimations = slideAnims.map((anim, index) => {
      return Animated.timing(anim, {
        toValue: 0,
        duration: 500,
        delay: index * 150,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      });
    });

    Animated.stagger(100, buttonAnimations).start();

    // Pulsing background animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 3000,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0,
          duration: 3000,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        })
      ])
    ).start();

    // Particle animations
    const particleAnimation = particleAnims.map((anim, index) => {
      return Animated.loop(
        Animated.sequence([
          Animated.delay(index * 200),
          Animated.timing(anim, {
            toValue: 1,
            duration: 3000 + Math.random() * 2000,
            easing: Easing.inOut(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.timing(anim, {
            toValue: 0,
            duration: 3000 + Math.random() * 2000,
            easing: Easing.inOut(Easing.quad),
            useNativeDriver: true,
          })
        ])
      );
    });

    particleAnimation.forEach(anim => anim.start());
  }, []);

  const handlePressIn = (index) => {
    Animated.spring(buttonScaleAnims[index], {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = (index) => {
    Animated.spring(buttonScaleAnims[index], {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  // Create floating particles
  const renderParticles = () => {
    return particleAnims.map((anim, index) => {
      const size = 5 + Math.random() * 8;
      const left = Math.random() * width;
      const top = Math.random() * height;
      
      const translateY = anim.interpolate({
        inputRange: [0, 1],
        outputRange: [0, -40 - Math.random() * 60]
      });
      
      const opacity = anim.interpolate({
        inputRange: [0, 0.5, 1],
        outputRange: [0.3, 0.7, 0.3]
      });
      
      const scale = anim.interpolate({
        inputRange: [0, 0.5, 1],
        outputRange: [0.8, 1.2, 0.8]
      });

      return (
        <Animated.View
          key={index}
          style={{
            position: 'absolute',
            left,
            top,
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: `rgba(41, 128, 185, ${0.2 + Math.random() * 0.3})`,
            transform: [{ translateY }, { scale }],
            opacity,
          }}
        />
      );
    });
  };

  const pulseInterpolation = pulseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['rgba(248, 251, 255, 1)', 'rgba(235, 245, 255, 1)']
  });

  return (
    <Animated.View style={[styles.container, { backgroundColor: pulseInterpolation }]}>
      {/* Background elements */}
      <View style={styles.background}>
        <View style={styles.circle1}></View>
        <View style={styles.circle2}></View>
        <View style={styles.circle3}></View>
      </View>
      
      {/* Floating particles */}
      {renderParticles()}
      
      <Animated.Text style={[styles.title, { transform: [{ scale: scaleAnim }] }]}>
        Welcome to <Text style={styles.highlight}>Norplex</Text>
      </Animated.Text>
      
      <Text style={styles.subtitle}>Select your login method</Text>

      {[
        { name: 'InstitutionLogin', text: 'Institution Login' },
        { name: 'TeacherLogin', text: 'Teacher/Lecturer Login' },
        { name: 'StudentLogin', text: 'Student Login' },
        { name: 'ParentLogin', text: 'Parent Login' }
      ].map((item, index) => (
        <Animated.View 
          key={index}
          style={{ 
            transform: [
              { translateY: slideAnims[index] },
              { scale: buttonScaleAnims[index] }
            ],
            opacity: slideAnims[index].interpolate({
              inputRange: [0, 100],
              outputRange: [1, 0]
            }),
            width: '100%',
            alignItems: 'center'
          }}
        >
          <TouchableOpacity
            style={[styles.button, index === 0 && styles.buttonPrimary]}
            onPress={() => navigation.navigate(item.name)}
            onPressIn={() => handlePressIn(index)}
            onPressOut={() => handlePressOut(index)}
            activeOpacity={0.7}
          >
            <Text style={[styles.buttonText, index === 0 && styles.buttonPrimaryText]}>
              {item.text}
            </Text>
          </TouchableOpacity>
        </Animated.View>
      ))}
      
      <View style={styles.footer}>
        <Text style={styles.footerText}>New to Norplex? </Text>
        <TouchableOpacity>
          <Text style={styles.footerLink}>Create Account</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  circle1: {
    position: 'absolute',
    top: -100,
    right: -50,
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: 'rgba(75, 156, 211, 0.1)',
  },
  circle2: {
    position: 'absolute',
    bottom: -100,
    left: -50,
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: 'rgba(41, 128, 185, 0.1)',
  },
  circle3: {
    position: 'absolute',
    top: '30%',
    left: -30,
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'rgba(52, 152, 219, 0.08)',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#2c3e50',
    textAlign: 'center',
  },
  highlight: {
    color: '#2980b9',
  },
  subtitle: {
    fontSize: 16,
    color: '#7f8c8d',
    marginBottom: 40,
  },
  button: {
    backgroundColor: '#fff',
    paddingVertical: 16,
    paddingHorizontal: 30,
    borderRadius: 12,
    marginVertical: 8,
    width: '90%',
    alignItems: 'center',
    shadowColor: '#3498db',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#e8f4fc',
  },
  buttonPrimary: {
    backgroundColor: '#2980b9',
    shadowColor: '#2980b9',
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  buttonText: {
    color: '#2980b9',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonPrimaryText: {
    color: '#fff',
  },
  footer: {
    flexDirection: 'row',
    marginTop: 30,
  },
  footerText: {
    color: '#7f8c8d',
  },
  footerLink: {
    color: '#3498db',
    fontWeight: '600',
  },
});