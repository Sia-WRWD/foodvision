import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'foodNamePipe'
})
export class foodNamePipe implements PipeTransform {
  transform(value: string): string {
    if (!value) return '';

    // Remove underscores and split the string into separate words
    const words = value.split('_');

    // Capitalize the first letter of each word
    const transformedWords = words.map(word => word.charAt(0).toUpperCase() + word.slice(1));

    // Join the transformed words and return the result
    return transformedWords.join(' ');
  }
}