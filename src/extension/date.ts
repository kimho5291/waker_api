export {}

declare global{
  interface Date{
    addDate(date: number): Date
    addMinute(minute: number): Date
    addSecond(second: number): Date
    getDateFormatYYMMDDTHHMMSS(): string,
    getDateFormatYY_MM_DD(): string
  }
}

Date.prototype.addDate = function(date: number): Date {
  this.setDate(this.getDate() + date)
  return this;
}

Date.prototype.addMinute = function(minute: number): Date {
  this.setMinutes(this.getMinutes() + minute)
  return this;
}

Date.prototype.addSecond = function(sesond: number): Date {
  this.setMinutes((this.getSeconds() + sesond)/60 + (this.getSeconds() + sesond)%60)
  return this;
}

Date.prototype.getDateFormatYYMMDDTHHMMSS = function(): string {
  return this.getFullYear() + 
  (this.getMonth()+1).toString().padStart(2, '0') + 
  this.getDate().toString().padStart(2, '0') +
  "T" +
  this.getHours().toString().padStart(2, '0') +
  "00"
  ;
}

Date.prototype.getDateFormatYY_MM_DD = function(): string {
  return this.getFullYear() + 
  "-" +
  (this.getMonth()+1).toString().padStart(2, '0') + 
  "-" +
  this.getDate().toString().padStart(2, '0')
  ;
}