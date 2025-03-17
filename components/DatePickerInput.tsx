import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Platform } from 'react-native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { Calendar } from 'lucide-react-native';
import { format } from 'date-fns';

interface DatePickerInputProps {
  label: string;
  value: Date;
  onChange: (date: Date) => void;
}

export function DatePickerInput({ label, value, onChange }: DatePickerInputProps) {
  const [show, setShow] = useState(false);

  const handleChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    setShow(Platform.OS === 'ios');
    if (selectedDate) {
      onChange(selectedDate);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <Pressable 
        style={({ pressed }) => [
          styles.inputContainer,
          pressed && styles.pressed
        ]}
        onPress={() => setShow(true)}
      >
        <Text style={styles.dateText}>
          {format(value, 'dd/MM/yyyy')}
        </Text>
        <Calendar size={20} color="#666" />
      </Pressable>

      {show && (
        <DateTimePicker
          value={value}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleChange}
          style={styles.picker}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 6,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 12,
    height: 48,
  },
  pressed: {
    backgroundColor: '#F9FAFB',
  },
  dateText: {
    fontSize: 16,
    color: '#1F2937',
  },
  picker: {
    backgroundColor: '#fff',
  },
});